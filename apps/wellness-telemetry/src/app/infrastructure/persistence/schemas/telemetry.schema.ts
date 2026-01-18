import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TelemetryDocument = HydratedDocument<Telemetry>;

@Schema({ collection: 'telemetry_data', timestamps: true })
export class Telemetry {
  @Prop({ required: true })
  studentId: string;

  @Prop({ required: true })
  type: string; // Ej: "HEART_RATE", "STRESS_LEVEL", "STEPS"

  @Prop({ required: true })
  value: number; // Ej: 85 (bpm), 8 (nivel estrés)

  @Prop()
  unit: string; // Ej: "bpm", "score", "steps"

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const TelemetrySchema = SchemaFactory.createForClass(Telemetry); 