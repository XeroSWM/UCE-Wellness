import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('appointments') // Ruta base: http://localhost:3003/api/appointments
export class AppController {
  constructor(private readonly appService: AppService) {}

  // 1. AGENDAR CITA (POST /api/appointments)
  @Post()
  create(@Body() body: any) {
    console.log('📅 Nueva solicitud de cita recibida:', body);
    return this.appService.create(body);
  }

  // 2. VER TODAS (GET /api/appointments)
  @Get()
  findAll() {
    return this.appService.findAll();
  }

  // 3. BUSCAR POR ESTUDIANTE (GET /api/appointments/student/:id)
  // Este lo usa tu nuevo Dashboard de Estudiante
  @Get('student/:id')
  findByStudent(@Param('id') id: string) {
    console.log(`🔎 Buscando citas del estudiante: ${id}`);
    return this.appService.findByStudent(id);
  }

  
}