variable "aws_region" {
  default = "us-east-1"
}

variable "microservices" {
  description = "Servicios activos. Descomenta poco a poco para evitar bloqueos de AWS."
  type = map(object({
    image       = string
    port        = number
    is_frontend = bool
    priority    = number
    path        = string
  }))

  default = {
    # === GRUPO 1: CRÍTICOS (Activos) ===
    "frontend" = {
      image       = "xxavyx38/uce-wellness-frontend"
      port        = 80
      is_frontend = true
      priority    = 100
      path        = "/*"
    },
    "api-gateway" = {
      image       = "xxavyx38/uce-api-gateway"
      port        = 3333
      is_frontend = false
      priority    = 10
      path        = "/api/*"
    },
    "auth-service" = {
      image       = "xxavyx38/uce-auth-service"
      port        = 3000
      is_frontend = false
      priority    = 20
      path        = "/auth/*"
    },
    "user-profile" = {
      image       = "xxavyx38/uce-user-profile"
      port        = 3001
      is_frontend = false
      priority    = 30
      path        = "/user/*"
    },

    # === GRUPO 2: SECUNDARIOS (Comentados - Descomenta SI el Grupo 1 funciona) ===
    # "assessment-service" = {
    #   image       = "xxavyx38/uce-assessment-service"
    #   port        = 3002
    #   is_frontend = false
    #   priority    = 40
    #   path        = "/assessment/*"
    # },
    # "appointment-service" = {
    #   image       = "xxavyx38/uce-appointment-service"
    #   port        = 3003
    #   is_frontend = false
    #   priority    = 50
    #   path        = "/appointment/*"
    # },
    # "wellness-telemetry" = {
    #   image       = "xxavyx38/uce-wellness-telemetry"
    #   port        = 3004
    #   is_frontend = false
    #   priority    = 60
    #   path        = "/telemetry/*"
    # },
    # "notification-service" = {
    #   image       = "xxavyx38/uce-notification-service"
    #   port        = 3005
    #   is_frontend = false
    #   priority    = 70
    #   path        = "/notification/*"
    # },

    # === GRUPO 3: RESTO (Comentados - Descomenta al final) ===
    # "audit-log" = {
    #   image       = "xxavyx38/uce-audit-log"
    #   port        = 3006
    #   is_frontend = false
    #   priority    = 80
    #   path        = "/audit/*"
    # },
    # "resource-library" = {
    #   image       = "xxavyx38/uce-resource-library"
    #   port        = 3007
    #   is_frontend = false
    #   priority    = 90
    #   path        = "/resources/*"
    # },
    # "analytics-engine" = {
    #   image       = "xxavyx38/uce-analytics-engine"
    #   port        = 3008
    #   is_frontend = false
    #   priority    = 95
    #   path        = "/analytics/*"
    # },
    # "support-chat" = {
    #   image       = "xxavyx38/uce-support-chat"
    #   port        = 3009
    #   is_frontend = false
    #   priority    = 96
    #   path        = "/chat/*"
    # }
  }
}