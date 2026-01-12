import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  
  // PUERTO 3003 PARA CITAS
  const port = process.env.PORT || 3003;
  
  await app.listen(port);
  Logger.log(
    `🚀 Appointment Service running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();