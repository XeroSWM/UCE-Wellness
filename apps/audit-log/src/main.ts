import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app/app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Conectar a RabbitMQ para escuchar eventos
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@localhost:5672'],
      queue: 'audit_queue', // Cola exclusiva para auditoría
      queueOptions: { durable: false },
    },
  });

  await app.startAllMicroservices();
  await app.listen(3006);
  Logger.log(`🚀 Audit-Log Service running on port 3006`);
}
bootstrap();