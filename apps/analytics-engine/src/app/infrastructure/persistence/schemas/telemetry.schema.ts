import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TelemetryDocument = HydratedDocument<Telemetry>;

// IMPORTANTE: Usamos la misma colección 'telemetry_data'
@Schema({ collection: 'telemetry_data', timestamps: true })
export class Telemetry {
  @Prop() studentId: string;
  @Prop() type: string;
  @Prop() value: number;
  @Prop() unit: string;
  @Prop() timestamp: Date;
}

export const TelemetrySchema = SchemaFactory.createForClass(Telemetry);