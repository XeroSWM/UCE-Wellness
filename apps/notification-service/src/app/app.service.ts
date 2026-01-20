import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  private readonly logger = new Logger('NotificationService 🔔');

  // URL DE TU WEBHOOK DE N8N (Asegúrate de que sea la correcta)
  // Si usas n8n desktop suele ser localhost:5678
  // Si usas n8n cloud, será una URL larga https://...
  private readonly n8nWebhookUrl = 'http://localhost:5678/webhook/email';

  constructor(private readonly httpService: HttpService) {}

  async sendEmail(data: { to: string; subject: string; message: string }) {
    try {
      this.logger.log(`🚀 Enviando solicitud a n8n para: ${data.to}`);

      // Enviamos los datos al Webhook de n8n
      await firstValueFrom(
        this.httpService.post(this.n8nWebhookUrl, {
          to: data.to,
          subject: data.subject,
          message: data.message
        })
      );

      this.logger.log('✅ n8n recibió la orden correctamente.');
      return { success: true, message: 'Correo procesado por n8n' };

    } catch (error) {
      this.logger.error(`❌ Error contactando a n8n: ${error.message}`);
      // No lanzamos error para no romper el flujo del usuario, pero lo registramos
      return { success: false, error: 'Fallo en n8n' };
    }
  }
}