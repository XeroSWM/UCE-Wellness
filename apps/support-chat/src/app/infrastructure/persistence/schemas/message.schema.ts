import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ collection: 'chat_messages', timestamps: true })
export class Message {
  @Prop({ required: true })
  senderId: string; // ID del estudiante o "SUPPORT_AGENT"

  @Prop({ required: true })
  content: string; // "Hola, necesito ayuda"

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);