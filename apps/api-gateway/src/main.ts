import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  app.enableCors(); // Permite que el Frontend se conecte
  
  // ⚠️ AQUÍ NO DEBE HABER NINGÚN 'setGlobalPrefix'

  const port = process.env.PORT || 3333;
  await app.listen(port);
  Logger.log(`🚀 API Gateway running on port: ${port}`);
}

bootstrap();