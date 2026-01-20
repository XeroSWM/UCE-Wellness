import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientProxy } from '@nestjs/microservices';

// Importamos los esquemas
import { Assessment, AssessmentDocument } from '../infrastructure/persistence/schemas/assessment.schema';
import { AssessmentResult, AssessmentResultDocument } from '../infrastructure/persistence/schemas/result.schema';

@Injectable()
export class AssessmentService {
  constructor(
    @InjectModel(Assessment.name) private assessmentModel: Model<AssessmentDocument>,
    @InjectModel(AssessmentResult.name) private resultModel: Model<AssessmentResultDocument>,
    
    // Inyectamos el cliente de RabbitMQ
    @Inject('NOTIFICATIONS_SERVICE') private readonly client: ClientProxy, 
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

  // 3. Guardar resultado (CON ALERTA DE CRISIS MEJORADA)
  async saveResult(resultDto: any): Promise<AssessmentResult> {
    const score = resultDto.totalScore;
    const max = resultDto.maxScore || 1;
    let riskLevel = 'Bajo';
    let requiresAttention = false;

    // Cálculo del porcentaje
    const percentage = (score / max) * 100;

    // Lógica de Riesgo
    if (percentage > 40) riskLevel = 'Moderado';
    
    // Si supera el 70% (o el puntaje de corte), es ALTO
    if (percentage > 70) {
      riskLevel = 'Alto';
      requiresAttention = true;
    }

    const dataToSave = {
      ...resultDto,
      riskLevel,
      requiresAttention
    };

    // === AQUÍ DISPARAMOS LA ALERTA A RABBITMQ ===
    if (requiresAttention) {
      console.warn(`🚨 ALERTA DE CRISIS: Estudiante ${resultDto.userId} en riesgo ALTO.`);

      const payload = {
        to: 'xeros100302@gmail.com', // Correo de alerta (psicólogo o admin)
        subject: '🚨 URGENTE: Alerta de Riesgo Alto Detectada',
        message: `ALERTA DE SEGURIDAD\n\nEl estudiante ha completado un test con resultados preocupantes.\n\n` +
                 `Puntaje: ${score}/${max}\n` +
                 `Nivel de Riesgo: ${riskLevel}\n` +
                 `Fecha: ${new Date().toLocaleString()}\n`,
        
        // [CAMBIO CLAVE] Enviamos el ID puro para que Notificaciones busque los datos
        userId: resultDto.userId, 
        riskData: { score, riskLevel }
      };

      // Emitimos el evento 'notify_risk' a la cola
      this.client.emit('notify_risk', payload);
      
      console.log('🐰 Notificación de riesgo enviada a RabbitMQ con userId:', resultDto.userId);
    }

    const newResult = new this.resultModel(dataToSave);
    return newResult.save();
  }

  // 4. Historial
  async getHistory(userId: string): Promise<AssessmentResult[]> {
    return this.resultModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  // 5. Buscar uno
  async findOne(idOrType: string): Promise<Assessment | null> {
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(idOrType);

    if (isMongoId) {
      const byId = await this.assessmentModel.findById(idOrType).exec();
      if (byId) return byId;
    }

    return this.assessmentModel.findOne({ type: idOrType }).exec();
  }
}