import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AssessmentDocument = HydratedDocument<Assessment>;

@Schema({ collection: 'assessments', timestamps: true })
export class Assessment {
  
  // === AGREGA ESTA LÍNEA ===
  // Es la etiqueta que usaremos en la URL (ej: 'beck', 'estres')
  @Prop({ required: true, unique: true }) 
  type: string; 
  // ==========================

  @Prop() title: string;
  @Prop() description: string;
  @Prop() category: string;
  
  // ... resto de tus campos (questions, etc.) ...
  @Prop({ type: [Object] }) 
  questions: any[];
}

export const AssessmentSchema = SchemaFactory.createForClass(Assessment);