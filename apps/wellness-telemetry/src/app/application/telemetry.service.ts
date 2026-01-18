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

  async processTelemetry(data: any) {
    // 1. Log para ver en tiempo real que el dato llegó
    this.logger.log(`📡 DATO RECIBIDO: ${data.type} = ${data.value} ${data.unit} (Estudiante: ${data.studentId})`);

    // 2. Guardar en MongoDB
    const newRecord = new this.telemetryModel(data);
    return newRecord.save();
  }
}