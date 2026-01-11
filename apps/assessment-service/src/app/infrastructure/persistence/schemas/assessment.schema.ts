import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AssessmentDocument = HydratedDocument<Assessment>;

@Schema()
class Question {
  @Prop({ required: true }) 
  text: string;

  @Prop([String])    
  options: string[];

  @Prop() 
  weight: number;
}

@Schema({ collection: 'assessments', timestamps: true })
export class Assessment {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop([Question]) // Aquí guardamos el array de preguntas
  questions: Question[];

  @Prop({ default: true })
  isActive: boolean;
}

export const AssessmentSchema = SchemaFactory.createForClass(Assessment);