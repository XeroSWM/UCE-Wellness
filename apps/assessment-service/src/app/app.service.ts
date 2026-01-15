import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Assessment } from './infrastructure/persistence/schemas/assessment.schema';
import { AssessmentResult } from './infrastructure/persistence/schemas/result.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Assessment.name) private assessmentModel: Model<Assessment>,
    @InjectModel(AssessmentResult.name) private resultModel: Model<AssessmentResult>,
  ) {}

  // 1. Obtener todos los tests (ya lo tenías)
  async findAll() {
    return this.assessmentModel.find().exec();
  }

  // 2. Crear un test nuevo (ya lo tenías, para Thunder Client)
  async create(data: any) {
    const created = new this.assessmentModel(data);
    return created.save();
  }

  // === NUEVO: GUARDAR RESULTADO DEL ESTUDIANTE ===
  async saveResult(data: any) {
    const newResult = new this.resultModel(data);
    return newResult.save();
  }

  // === NUEVO: VER HISTORIAL DE UN ESTUDIANTE ===
  async getHistory(userId: string) {
    // Busca por ID de estudiante y ordena por fecha (el más nuevo primero)
    return this.resultModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }
}