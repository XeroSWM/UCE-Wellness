import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS para que el Frontend pueda conectarse al socket
  app.enableCors();

  const port = process.env.PORT || 3009;
  await app.listen(port);
  
  Logger.log(
    `🚀 Support Chat Service is running on: http://localhost:${port}`
  );
}

bootstrap();