import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Assessment, AssessmentDocument } from '../infrastructure/persistence/schemas/assessment.schema';

@Injectable()
export class AssessmentService {
  constructor(
    @InjectModel(Assessment.name) private assessmentModel: Model<AssessmentDocument>
  ) {}

  // Función para guardar un nuevo test en Mongo
  async create(createAssessmentDto: any): Promise<Assessment> {
    const createdAssessment = new this.assessmentModel(createAssessmentDto);
    return createdAssessment.save();
  }

  // Función para listar todos los tests
  async findAll(): Promise<Assessment[]> {
    return this.assessmentModel.find().exec();
  }
}