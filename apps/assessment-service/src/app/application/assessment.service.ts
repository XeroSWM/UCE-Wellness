import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// Importamos los esquemas
import { Assessment, AssessmentDocument } from '../infrastructure/persistence/schemas/assessment.schema';
import { AssessmentResult, AssessmentResultDocument } from '../infrastructure/persistence/schemas/result.schema';

@Injectable()
export class AssessmentService {
  constructor(
    @InjectModel(Assessment.name) private assessmentModel: Model<AssessmentDocument>,
    @InjectModel(AssessmentResult.name) private resultModel: Model<AssessmentResultDocument>
  ) {}

  // 1. Crear un nuevo test
  async create(createAssessmentDto: any): Promise<Assessment> {
    const createdAssessment = new this.assessmentModel(createAssessmentDto);
    return createdAssessment.save();
  }

  // 2. Listar todos los tests
  async findAll(): Promise<Assessment[]> {
    return this.assessmentModel.find().exec();
  }

  // 3. Guardar resultado (Con lógica de riesgo)
  async saveResult(resultDto: any): Promise<AssessmentResult> {
    const score = resultDto.totalScore;
    const max = resultDto.maxScore || 1;
    let riskLevel = 'Bajo';
    let requiresAttention = false;

    const percentage = (score / max) * 100;

    if (percentage > 40) riskLevel = 'Moderado';
    if (percentage > 70) {
      riskLevel = 'Alto';
      requiresAttention = true;
    }

    const dataToSave = {
      ...resultDto,
      riskLevel,
      requiresAttention
    };

    if (requiresAttention) {
      console.warn(`⚠️ ALERTA: Estudiante ${resultDto.userId} en riesgo ALTO.`);
    }

    const newResult = new this.resultModel(dataToSave);
    return newResult.save();
  }

  // 4. Historial
  async getHistory(userId: string): Promise<AssessmentResult[]> {
    return this.resultModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  // === 5. ¡ESTE ES EL MÉTODO QUE FALTABA! ===
  // Busca un test ya sea por su ID de Mongo (_id) O por su "tipo" (ej: 'beck')
  async findOne(idOrType: string): Promise<Assessment | null> {
    
    // Verificamos si parece un ID de Mongo (24 caracteres hexadecimales)
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(idOrType);

    if (isMongoId) {
      // Intentar buscar por ID primero
      const byId = await this.assessmentModel.findById(idOrType).exec();
      if (byId) return byId;
    }

    // Si no es ID (o no se encontró), buscamos por el campo "type" (ej: "beck")
    return this.assessmentModel.findOne({ type: idOrType }).exec();
  }
}