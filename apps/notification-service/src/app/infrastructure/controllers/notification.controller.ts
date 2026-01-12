import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationService } from '../../application/notification.service';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern('appointment_created')
  handleAppointmentCreated(@Payload() data: any) {
    // Cuando llega el mensaje, le decimos al servicio que "envíe el correo"
    this.notificationService.notifyAppointment(data);
  }
}