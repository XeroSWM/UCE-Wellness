import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  // 1. Creamos la App HTTP normal (para que el Frontend pueda pedir datos)
  const app = await NestFactory.create(AppModule);
  
  // 2. Conectamos el Microservicio MQTT (para que los sensores sigan funcionando)
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.MQTT,
    options: {
      url: 'mqtt://localhost:1883',
    },
  });

  // 3. Configuración Global
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableCors(); // ¡Vital para que React no de error!

  // 4. Iniciamos todo (Microservicios + HTTP en puerto 3004)
  await app.startAllMicroservices();
  
  const port = process.env.PORT || 3004; // Usaremos el 3004
  await app.listen(port);
  
  Logger.log(`🚀 Telemetry HTTP running on: http://localhost:${port}/${globalPrefix}`);
  Logger.log(`📡 Telemetry MQTT running on: mqtt://localhost:1883`);
}

bootstrap();