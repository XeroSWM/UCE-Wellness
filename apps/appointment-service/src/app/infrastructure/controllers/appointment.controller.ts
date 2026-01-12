import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppointmentService } from '../../application/appointment.service';

@Controller('appointments') // Ruta: /api/appointments
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  create(@Body() body: any) {
    return this.appointmentService.create(body);
  }

  @Get()
  findAll() {
    return this.appointmentService.findAll();
  }
}