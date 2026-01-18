import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './infrastructure/persistence/schemas/message.schema';
import { ChatGateway } from './infrastructure/gateways/chat.gateway';

@Module({
  imports: [
    // Conexión a Mongo (misma base de datos de Telemetría o una nueva)
    MongooseModule.forRoot('mongodb://admin:securepassword@localhost:27017/uce-wellness-chat?authSource=admin'),
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
  controllers: [],
  providers: [ChatGateway], // <--- Aquí registramos el Gateway
})
export class AppModule {}