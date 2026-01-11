import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  // CORRECCIÓN: Desactivamos bodyParser para que el Proxy pueda enviar los datos crudos
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  
  const port = process.env.PORT || 3333;
  
  await app.listen(port);
  
  Logger.log(
    `🚀 API Gateway corriendo en: http://localhost:${port}`
  );
}

bootstrap();