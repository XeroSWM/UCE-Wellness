import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  @EventPattern('appointment_created')
  handleAppointmentCreated(@Payload() data: any) {
    // Aquí simulamos guardar en una tabla de auditoría SQL
    this.logger.log(`🕵️ AUDITORÍA: Se detectó creación de cita.`);
    this.logger.log(`   - Usuario: ${data.studentId}`);
    this.logger.log(`   - Fecha: ${new Date().toISOString()}`);
    this.logger.log(`   - Acción: INSERT en Base de Datos de Citas.`);
  }
}