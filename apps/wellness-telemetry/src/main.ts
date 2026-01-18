import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.MQTT,
    options: {
      url: 'mqtt://localhost:1883', // Puerto de Mosquitto
    },
  });

  await app.listen();
  Logger.log('🚀 Wellness Telemetry Microservice is listening via MQTT on port 1883');
}

bootstrap();