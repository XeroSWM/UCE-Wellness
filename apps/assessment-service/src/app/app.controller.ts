import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('assessments') // Esto define la ruta base: /api/assessments
export class AppController {
  constructor(private readonly appService: AppService) {}

  // GET /api/assessments
  @Get()
  findAll() {
    return this.appService.findAll();
  }

  // POST /api/assessments (Para crear las preguntas)
  @Post()
  create(@Body() body: any) {
    return this.appService.create(body);
  }

  // === NUEVOS ENDPOINTS ===

  // POST /api/assessments/results  (Para guardar lo que responde el estudiante)
  @Post('results')
  async saveResult(@Body() body: any) {
    console.log('📝 Guardando resultado:', body);
    return this.appService.saveResult(body);
  }

  // GET /api/assessments/history/:userId  (Para ver el historial en "Mi Progreso")
  @Get('history/:userId')
  async getHistory(@Param('userId') userId: string) {
    console.log('🔍 Buscando historial para:', userId);
    return this.appService.getHistory(userId);
  }
}