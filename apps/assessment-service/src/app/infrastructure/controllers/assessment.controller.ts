import { Controller, Get, Post, Body, Param, NotFoundException } from '@nestjs/common';
import { AssessmentService } from '../../application/assessment.service';

@Controller('assessments')
export class AssessmentController {
  constructor(private readonly assessmentService: AssessmentService) {}

  // 1. Obtener todos
  @Get()
  findAll() {
    return this.assessmentService.findAll();
  }

  // 2. Crear (Seed)
  @Post()
  create(@Body() body: any) {
    return this.assessmentService.create(body);
  }

  // 3. Guardar Resultados
  @Post('results')
  saveResult(@Body() body: any) {
    return this.assessmentService.saveResult(body);
  }

  // 4. Historial
  @Get('history/:userId')
  getHistory(@Param('userId') userId: string) {
    return this.assessmentService.getHistory(userId);
  }

  // === 5. ESTA ES LA RUTA QUE TE FALTA ===
  // Sin esto, el frontend recibe un error 404
  @Get(':id')
  async getOne(@Param('id') id: string) {
    const assessment = await this.assessmentService.findOne(id);
    if (!assessment) {
      throw new NotFoundException(`Test no encontrado: ${id}`);
    }
    return assessment;
  }
}