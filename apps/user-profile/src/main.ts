import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 1. AGREGAMOS ESTO (Para que sea igual al Auth-Service)
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  Logger.log(
    `🚀 User Profile corriendo en: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();