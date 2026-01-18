import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  
  // Configuración del prefijo global
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  
  // IMPORTANTE: Cambiamos al puerto 3002
  const port = process.env.PORT || 3002;
  
  await app.listen(port);
  
  Logger.log(
    `🚀 Assessment Service is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();