import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  notifyAppointment(data: any) {
    this.logger.log('📧 ==================================================');
    this.logger.log(`📧 ENVIANDO CORREO A: Estudiante ${data.studentId}`);
    this.logger.log(`📧 ASUNTO: Confirmación de cita con ${data.professionalName}`);
    this.logger.log(`📧 FECHA: ${data.date}`);
    this.logger.log('📧 MENSAJE: Tu cita ha sido agendada correctamente.');
    this.logger.log('📧 ==================================================');
  }
}