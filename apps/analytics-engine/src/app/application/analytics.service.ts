import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Telemetry, TelemetryDocument } from '../infrastructure/persistence/schemas/telemetry.schema';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    @InjectModel(Telemetry.name) private telemetryModel: Model<TelemetryDocument>
  ) {}

  // SE EJECUTA CADA 10 SEGUNDOS
  @Cron('*/10 * * * * *')
  async analyzeStressLevels() {
    this.logger.debug('🧠 Analizando datos simulados recientes...');

    // Busca datos de los últimos 5 minutos
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    const recentData = await this.telemetryModel.find({
      type: 'HEART_RATE',
      createdAt: { $gte: fiveMinutesAgo }
    }).exec();

    if (recentData.length === 0) {
      this.logger.log('💤 No hay nuevos datos simulados para analizar.');
      return;
    }

    // Calcula promedio
    const sum = recentData.reduce((acc, item) => acc + item.value, 0);
    const average = sum / recentData.length;

    this.logger.log(`📊 Promedio cardíaco (Simulado): ${average.toFixed(1)} bpm`);

    // Regla: Si > 100 es Estrés
    if (average > 100) {
      this.logger.warn(`🚨 ALERTA DE ESTRÉS: Taquicardia detectada (${average.toFixed(1)} bpm).`);
    } else {
      this.logger.log('✅ Signos vitales normales.');
    }
  }
}