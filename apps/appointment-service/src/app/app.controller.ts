import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('appointments') // Ruta base: http://localhost:3003/api/appointments
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Endpoint para agendar: POST /api/appointments
  @Post()
  create(@Body() body: any) {
    console.log('📅 Nueva solicitud de cita:', body);
    return this.appService.create(body);
  }

  // Endpoint historial estudiante: GET /api/appointments/student/:id
  @Get('student/:id')
  findByStudent(@Param('id') id: string) {
    return this.appService.findByStudent(id);
  }

  // Endpoint ver todo: GET /api/appointments
  @Get()
  findAll() {
    return this.appService.findAll();
  }
}