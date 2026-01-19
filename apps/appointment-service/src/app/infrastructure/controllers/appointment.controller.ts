import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AppointmentService } from '../../application/appointment.service';

@Controller('appointments') // Ruta base: /api/appointments
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  // 1. Agendar Cita (POST)
  @Post()
  create(@Body() body: any) {
    return this.appointmentService.create(body);
  }

  // 2. Ver todas (GET)
  @Get()
  findAll() {
    return this.appointmentService.findAll();
  }

  // 3. BUSCAR POR ESTUDIANTE (GET /student/:id) -> ¡VITAL PARA EL DASHBOARD!
  @Get('student/:id')
  findByStudent(@Param('id') id: string) {
    return this.appointmentService.findByStudent(id);
  }

}