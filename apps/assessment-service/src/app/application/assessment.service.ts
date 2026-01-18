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

    // Inyectamos el modelo de Resultados (Historial)
    @InjectModel(AssessmentResult.name) private resultModel: Model<AssessmentResultDocument>
  ) {}

  // 1. Crear un nuevo test (usado por Thunder Client/Admin para cargar preguntas)
  async create(createAssessmentDto: any): Promise<Assessment> {
    const createdAssessment = new this.assessmentModel(createAssessmentDto);
    return createdAssessment.save();
  }

  // 2. Listar todos los tests disponibles para el estudiante
  async findAll(): Promise<Assessment[]> {
    return this.assessmentModel.find().exec();
  }

  // 3. Guardar el resultado con LÓGICA DE ALERTA AUTOMÁTICA
  async saveResult(resultDto: any): Promise<AssessmentResult> {
    
    // A. Calculamos el riesgo automáticamente basado en el puntaje
    const score = resultDto.totalScore;
    const max = resultDto.maxScore || 1; // Evitamos división por cero
    let riskLevel = 'Bajo';
    let requiresAttention = false;

    // Calculamos el porcentaje obtenido
    const percentage = (score / max) * 100;

    // Reglas de negocio (puedes ajustarlas según el test específico si deseas)
    if (percentage > 40) {
      riskLevel = 'Moderado';
    }
    if (percentage > 70) {
      riskLevel = 'Alto';
      requiresAttention = true; // ¡ALERTA! Marca este caso para el doctor
    }

    // B. Preparamos el objeto final con los datos calculados
    const dataToSave = {
      ...resultDto,
      riskLevel,
      requiresAttention
    };

    // C. Simulación de Notificación (Aquí conectarías con Notification-Service en el futuro)
    if (requiresAttention) {
      console.warn(`⚠️ ALERTA CRÍTICA: El estudiante ${resultDto.userId} tiene riesgo ALTO (${score}/${max} pts).`);
      console.log(`📧 [Simulación] Enviando correo de alerta al Departamento de Bienestar...`);
      // await this.notificationService.notifyDoctor(...) 
    }

    // D. Guardar en MongoDB
    const newResult = new this.resultModel(dataToSave);
    return newResult.save();
  }

  // 4. Obtener el historial de un estudiante específico (para "Mi Progreso")
  async getHistory(userId: string): Promise<AssessmentResult[]> {
    // Busca por ID de usuario y ordena del más reciente al más antiguo (-1)
    return this.resultModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }
}