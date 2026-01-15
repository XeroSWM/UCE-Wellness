import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// Importamos los esquemas (Schemas)
import { Assessment, AssessmentDocument } from '../infrastructure/persistence/schemas/assessment.schema';
import { AssessmentResult, AssessmentResultDocument } from '../infrastructure/persistence/schemas/result.schema';

@Injectable()
export class AssessmentService {
  constructor(
    // Inyectamos el modelo de Preguntas (Tests)
    @InjectModel(Assessment.name) private assessmentModel: Model<AssessmentDocument>,
    
    // Inyectamos el modelo de Resultados (Historial) - ¡NUEVO!
    @InjectModel(AssessmentResult.name) private resultModel: Model<AssessmentResultDocument>
  ) {}

  // 1. Crear un nuevo test (usado por Thunder Client/Admin)
  async create(createAssessmentDto: any): Promise<Assessment> {
    const createdAssessment = new this.assessmentModel(createAssessmentDto);
    return createdAssessment.save();
  }

  // 2. Listar todos los tests disponibles
  async findAll(): Promise<Assessment[]> {
    return this.assessmentModel.find().exec();
  }

  // 3. Guardar el resultado de un estudiante - ¡NUEVO!
  async saveResult(resultDto: any): Promise<AssessmentResult> {
    const newResult = new this.resultModel(resultDto);
    return newResult.save();
  }

  // 4. Obtener el historial de un estudiante específico - ¡NUEVO!
  async getHistory(userId: string): Promise<AssessmentResult[]> {
    // Busca por ID y ordena del más reciente al más antiguo (-1)
    return this.resultModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }
}