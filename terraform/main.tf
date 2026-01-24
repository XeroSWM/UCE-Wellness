provider "aws" {
  region = var.aws_region
}

# ==========================================
# 1. RED (VPC y SUBREDES MULTI-AZ)
# ==========================================
resource "aws_vpc" "main_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  tags = { Name = "uce-wellness-vpc" }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main_vpc.id
  tags = { Name = "uce-wellness-igw" }
}

# Obtener zonas de disponibilidad disponibles (ej. us-east-1a, us-east-1b)
data "aws_availability_zones" "available" {
  state = "available"
}

# Crear 2 Subredes Públicas en diferentes zonas (Requisito OBLIGATORIO del ALB)
resource "aws_subnet" "public_subnets" {
  count                   = 2
  vpc_id                  = aws_vpc.main_vpc.id
  cidr_block              = "10.0.${count.index + 1}.0/24" # 10.0.1.0/24 y 10.0.2.0/24
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = { Name = "uce-subnet-${count.index + 1}" }
}

resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.main_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
}

resource "aws_route_table_association" "a" {
  count          = 2
  subnet_id      = aws_subnet.public_subnets[count.index].id
  route_table_id = aws_route_table.public_rt.id
}

# ==========================================
# 2. SEGURIDAD (Security Groups)
# ==========================================

# SG para el Load Balancer (Abierto al mundo puerto 80)
resource "aws_security_group" "alb_sg" {
  name        = "uce-alb-sg"
  vpc_id      = aws_vpc.main_vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# SG para las Instancias (Acepta tráfico del ALB + Acceso directo)
resource "aws_security_group" "instance_sg" {
  for_each = var.microservices
  
  # --- CORRECCIÓN 1: Nombre sin prefijo 'sg-' ---
  name     = "uce-sg-${each.key}" 
  vpc_id   = aws_vpc.main_vpc.id

  # Permitir tráfico desde el Load Balancer
  ingress {
    from_port       = each.value.port
    to_port         = each.value.port
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }

  # MANTENER ACCESO DIRECTO (IP Estática)
  ingress {
    from_port   = each.value.port
    to_port     = each.value.port
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  # SSH para admin (Puerto 22)
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ==========================================
# 3. INSTANCIAS EC2
# ==========================================
data "aws_ami" "amazon_linux_2" {
  most_recent = true
  owners      = ["amazon"]
  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

resource "aws_instance" "microservice_instance" {
  for_each = var.microservices

  ami           = data.aws_ami.amazon_linux_2.id
  instance_type = "t2.micro"
  
  # Usar la primera subred para las instancias
  subnet_id     = aws_subnet.public_subnets[0].id
  
  vpc_security_group_ids = [aws_security_group.instance_sg[each.key].id]

  # User Data: Instala Docker y corre el contenedor automáticamente
  user_data = <<-EOF
              #!/bin/bash
              yum update -y
              amazon-linux-extras install docker -y
              service docker start
              usermod -a -G docker ec2-user
              
              if [ "${each.value.is_frontend}" = "true" ]; then
                # El frontend interno en contenedor (80) se mapea al 80 del servidor
                docker run -d --restart always -p 80:80 ${each.value.image}:latest
              else
                # Los backends usan su puerto específico
                docker run -d --restart always -p ${each.value.port}:${each.value.port} ${each.value.image}:latest
              fi
              EOF

  tags = { Name = "uce-${each.key}" }
}

resource "aws_eip" "service_eip" {
  for_each = var.microservices
  
  instance = aws_instance.microservice_instance[each.key].id
  
  # --- CORRECCIÓN 2: Sintaxis nueva para proveedores AWS v5+ ---
  domain   = "vpc" 
  
  tags     = { Name = "eip-${each.key}" }
  
  depends_on = [aws_internet_gateway.igw]
}

# ==========================================
# 4. LOAD BALANCER (ALB)
# ==========================================
resource "aws_lb" "main_alb" {
  name               = "uce-wellness-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  
  # El ALB se conecta a AMBAS subredes para alta disponibilidad
  subnets            = aws_subnet.public_subnets[*].id

  tags = { Name = "uce-wellness-alb" }
}

# Crear un Target Group por cada servicio
resource "aws_lb_target_group" "service_tg" {
  for_each = var.microservices

  name     = "tg-${each.key}"
  port     = each.value.is_frontend ? 80 : each.value.port
  protocol = "HTTP"
  vpc_id   = aws_vpc.main_vpc.id
  target_type = "instance"

  health_check {
    path                = "/" 
    healthy_threshold   = 2
    unhealthy_threshold = 10
    timeout             = 5
    interval            = 10
    matcher             = "200-404"
  }
}

# Unir las Instancias a los Target Groups
resource "aws_lb_target_group_attachment" "tg_attachment" {
  for_each = var.microservices

  target_group_arn = aws_lb_target_group.service_tg[each.key].arn
  target_id        = aws_instance.microservice_instance[each.key].id
  port             = each.value.is_frontend ? 80 : each.value.port
}

# Listener Principal (Puerto 80)
resource "aws_lb_listener" "http_listener" {
  load_balancer_arn = aws_lb.main_alb.arn
  port              = "80"
  protocol          = "HTTP"

  # Acción por defecto: Enviar al Frontend (Prioridad más baja)
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.service_tg["frontend"].arn
  }
}

# Reglas de Enrutamiento (Path Based Routing) para Backends
resource "aws_lb_listener_rule" "service_routing" {
  for_each = { for k, v in var.microservices : k => v if k != "frontend" }

  listener_arn = aws_lb_listener.http_listener.arn
  priority     = each.value.priority

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.service_tg[each.key].arn
  }

  condition {
    path_pattern {
      values = [each.value.path]
    }
  }
}