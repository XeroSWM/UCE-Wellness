import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 1. HABILITAR CORS (Obligatorio para que React entre)
  app.enableCors();

  // 2. PREFIJO GLOBAL (Para que la ruta sea /api/appointments)
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // 3. PUERTO 3003 (Para no chocar con el 3002 de evaluaciones)
  const port = process.env.PORT || 3003;
  
  await app.listen(port);
  Logger.log(
    `🚀 Appointment Service is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();