import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS para que el Frontend pueda pedir los PDFs/Videos
  app.enableCors();

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  
  const port = process.env.PORT || 3007; // <--- PUERTO 3007
  await app.listen(port);
  
  Logger.log(
    `🚀 Resource Library running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();