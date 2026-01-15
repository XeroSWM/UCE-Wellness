import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AssessmentService } from '../../application/assessment.service'; // Ajusta la ruta si es necesario

@Controller('assessments') // Ruta base: http://localhost:3002/api/assessments
export class AssessmentController {
  constructor(private readonly assessmentService: AssessmentService) {}

  @Get()
  findAll() {
    return this.assessmentService.findAll();
  }

  @Post()
  create(@Body() body: any) {
    return this.assessmentService.create(body);
  }

  // === AQUÍ ESTÁ LA RUTA QUE FALTABA ===
  @Post('results')
  async saveResult(@Body() body: any) {
    console.log('✅ Recibiendo resultado:', body);
    return this.assessmentService.saveResult(body);
  }

  @Get('history/:userId')
  async getHistory(@Param('userId') userId: string) {
    return this.assessmentService.getHistory(userId);
  }
}