import { Controller, Get, Post, Body } from '@nestjs/common';
import { AssessmentService } from '../../application/assessment.service';

@Controller('assessments') // Esto crea la ruta: /api/assessments
export class AssessmentController {
  constructor(private readonly assessmentService: AssessmentService) {}

  @Post()
  create(@Body() body: any) {
    return this.assessmentService.create(body);
  }

  @Get()
  findAll() {
    return this.assessmentService.findAll();
  }
}