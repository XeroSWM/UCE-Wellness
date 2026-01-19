import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // Conectar a RabbitMQ
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@localhost:5672'],
      queue: 'notifications_queue',
      queueOptions: {
        durable: false
      },
    },
  });

  await app.startAllMicroservices();
  
  const port = process.env.PORT || 3005;
  await app.listen(port);
  
  Logger.log(
    `🚀 Notification Service is listening on HTTP:${port} and RabbitMQ Queue`
  );
}

bootstrap();