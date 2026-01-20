import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  // 1. Crear la aplicación
  const app = await NestFactory.create(AppModule);

  // 2. Conectar el Microservicio (RabbitMQ)
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@localhost:5672'], // Tu url de Rabbit
      queue: 'notifications_queue', // ¡IMPORTANTE! La misma cola que pusiste en appointment
      queueOptions: {
        durable: false
      },
    },
  });

  // 3. Iniciar servicios híbridos (HTTP + RabbitMQ)
  await app.startAllMicroservices();
  await app.listen(3005);
  console.log(`🚀 Notification Service escuchando en puerto 3005 y RabbitMQ`);
}
bootstrap();