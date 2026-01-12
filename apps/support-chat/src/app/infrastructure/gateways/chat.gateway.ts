import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from '../persistence/schemas/message.schema';

// Configuramos CORS para que acepte conexiones desde cualquier lado (*)
@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>
  ) {}

  // 1. Cuando alguien se conecta
  handleConnection(client: Socket) {
    console.log(`🔌 Cliente conectado al Chat: ${client.id}`);
  }

  // 2. Cuando alguien se desconecta
  handleDisconnect(client: Socket) {
    console.log(`❌ Cliente desconectado: ${client.id}`);
  }

  // 3. Cuando alguien envía un mensaje ('send_message')
  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody() payload: { senderId: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log(`💬 Mensaje recibido de ${payload.senderId}: ${payload.content}`);

    // A. Guardar en MongoDB
    const newMessage = new this.messageModel(payload);
    await newMessage.save();

    // B. Reenviar el mensaje a TODOS los conectados (Broadcast)
    // En la vida real, lo enviarías solo a la sala del usuario, pero esto sirve para la demo.
    this.server.emit('receive_message', payload);
  }
}