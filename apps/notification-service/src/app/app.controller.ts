import { Controller } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import axios from 'axios';

@Controller()
export class AppController {
  
  constructor() {
    console.log('🚨 Notification Controller Listo y Escuchando...');
  }

  // 1. Manejador de CITAS (Simple)
  @EventPattern('notify_appointment')
  async handleAppointment(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('📅 Cita recibida');
    this.sendToN8N(data);
  }

  // 2. ALERTA DE RIESGO (¡AQUÍ OCURRE LA MAGIA! 💎)
  @EventPattern('notify_risk')
  async handleRiskAlert(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('🚨 Alerta de Riesgo recibida. Buscando datos del estudiante...');

    let enrichedMessage = data.message; // Empezamos con el mensaje básico

    try {
      // A. Consultamos al Microservicio de Perfiles (User-Profile)
      // Usamos el ID que nos mandó el Assessment Service
      const profileResponse = await axios.get(`http://localhost:3001/api/profiles/${data.userId}`);
      const profile = profileResponse.data;

      // B. Si encontramos el perfil, agregamos los datos al correo
      if (profile) {
        console.log('✅ Perfil encontrado:', profile.name);
        
        enrichedMessage += `\n----------------------------------\n`;
        enrichedMessage += `📋 DATOS DE CONTACTO DEL ESTUDIANTE:\n`;
        enrichedMessage += `👤 Nombre: ${profile.name}\n`;
        enrichedMessage += `📱 Teléfono: ${profile.phoneNumber || 'No registrado'}\n`;
        enrichedMessage += `🏫 Facultad: ${profile.faculty || 'No registrada'}\n`;
        enrichedMessage += `🎓 Carrera: ${profile.career || 'No registrada'}\n`;
        enrichedMessage += `📚 Semestre: ${profile.semester || 'No registrado'}\n`;
        enrichedMessage += `----------------------------------`;
      }
    } catch (error) {
      console.error('⚠️ No se pudo obtener el perfil (¿El estudiante no lo ha completado?):', error.message);
      // No importa si falla, enviamos la alerta igual (aunque sea sin datos extra)
    }

    // C. Preparamos el paquete final para n8n
    const finalPayload = {
      ...data,
      message: enrichedMessage // Reemplazamos el mensaje simple por el enriquecido
    };

    console.log('🚀 Enviando alerta completa a n8n...');
    this.sendToN8N(finalPayload);
  }

  // Función auxiliar
  async sendToN8N(data: any) {
    try {
      await axios.post('http://localhost:5678/webhook/email', data);
      console.log('✅ Correo entregado a n8n');
    } catch (error) {
      console.error('❌ Error n8n:', error.message);
    }
  }
}