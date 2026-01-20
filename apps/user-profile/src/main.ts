import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. HABILITAR CORS (¡Vital para que React funcione!)
  app.enableCors();

  // 2. PREFIJO GLOBAL (Para que la ruta sea /api/profiles)
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // 3. PUERTO 3001
  const port = process.env.PORT || 3001;
  
  await app.listen(port);
  Logger.log(
    `🚀 User Profile Service is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();