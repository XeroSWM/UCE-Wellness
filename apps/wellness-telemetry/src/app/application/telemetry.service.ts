import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Telemetry, TelemetryDocument } from '../infrastructure/persistence/schemas/telemetry.schema';

@Injectable()
export class TelemetryService {
  private readonly logger = new Logger(TelemetryService.name);

  constructor(
    @InjectModel(Telemetry.name) private telemetryModel: Model<TelemetryDocument>
  ) {}

  // 1. Guardar en BD (MQTT)
  async processTelemetry(data: any) {
    this.logger.log(`📡 DATO RECIBIDO: ${data.value}`);
    const newRecord = new this.telemetryModel(data);
    return newRecord.save();
  }

  // 2. Generar Historial Semanal (Simulado)
  getWeeklyHistory(userId: string) {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const today = new Date().getDay(); 
    const history = [];
    
    for (let i = 6; i >= 0; i--) {
      const dayIndex = (today - i + 7) % 7;
      history.push({
        day: days[dayIndex],
        value: Math.floor(Math.random() * (90 - 20 + 1)) + 20,
        date: new Date(Date.now() - i * 86400000).toISOString()
      });
    }
    return history;
  }

  // 3. Generar Dato en Vivo (Simulado)
  getRealTimeData(userId: string) {
    // Generamos un valor aleatorio entre 60 y 100
    const randomValue = Math.floor(Math.random() * (100 - 60 + 1)) + 60;
    
    return {
      value: randomValue,
      unit: 'BPM', 
      timestamp: new Date().toISOString()
    };
  }
}