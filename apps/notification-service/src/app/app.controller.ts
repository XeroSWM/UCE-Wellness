import { Controller } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import axios from 'axios';

@Controller()
export class AppController {
  
  // === PRUEBA DE VIDA ===
  constructor() {
    console.log('🚨🚨🚨 EL CONTROLADOR DE NOTIFICACIONES SE HA CARGADO 🚨🚨🚨');
  }

  @EventPattern('notify_appointment')
  async handleNotification(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('✅ ¡Mensaje recibido por fin!', data);
    
    // Confirmamos a RabbitMQ que el mensaje se procesó (para que no se quede colgado)
    // Nota: Si usas noAck: false en main.ts, necesitas esto. Si no, no hace daño.
    // const channel = context.getChannelRef();
    // const originalMsg = context.getMessage();
    // channel.ack(originalMsg);

    try {
      await axios.post('http://localhost:5678/webhook/email', data);
      console.log('🚀 Enviado a n8n correctamente');
    } catch (error) {
      console.error('❌ Error enviando a n8n:', error.message);
    }
  }
}