import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AssessmentResultDocument = AssessmentResult & Document;

@Schema({ timestamps: true })
export class AssessmentResult {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  assessmentTitle: string;

  @Prop({ required: true })
  totalScore: number;

  @Prop({ required: true })
  maxScore: number;

  // --- NUEVOS CAMPOS ---
  @Prop()
  riskLevel: string; // 'Bajo', 'Moderado', 'Alto'

  @Prop({ default: false })
  requiresAttention: boolean; // true si el puntaje es muy alto
  // ---------------------

  @Prop({ type: Object })
  answers: Record<string, number>;
}

export const AssessmentResultSchema = SchemaFactory.createForClass(AssessmentResult);