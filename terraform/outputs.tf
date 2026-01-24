output "load_balancer_dns" {
  description = "URL Principal del Sistema (Acceso Web)"
  value       = "http://${aws_lb.main_alb.dns_name}"
}

output "ips_estaticas_individuales" {
  description = "IPs directas de cada microservicio (Para debug)"
  value = {
    for k, v in aws_eip.service_eip : k => v.public_ip
  }
}