import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices'; // <--- 1. IMPORTAR ESTO

// Importaciones de tus Esquemas
import { Assessment, AssessmentSchema } from './infrastructure/persistence/schemas/assessment.schema';
import { AssessmentResult, AssessmentResultSchema } from './infrastructure/persistence/schemas/result.schema';

// Importaciones de Controlador y Servicio
import { AssessmentController } from './infrastructure/controllers/assessment.controller';
import { AssessmentService } from './application/assessment.service';

@Module({
  imports: [
    // 1. CONEXIÓN A MONGODB CON AUTENTICACIÓN
    MongooseModule.forRoot(
      'mongodb://admin:securepassword@localhost:27017/uce-wellness-assessments?authSource=admin'
    ),
    
    // 2. REGISTRO DE MODELOS (Colecciones en la BD)
    MongooseModule.forFeature([
      { name: Assessment.name, schema: AssessmentSchema },
      { name: AssessmentResult.name, schema: AssessmentResultSchema }
    ]),

    // 3. CONEXIÓN A RABBITMQ (NUEVO - Para enviar alertas)
    ClientsModule.register([
      {
        name: 'NOTIFICATIONS_SERVICE', // Nombre exacto que usamos en el @Inject del Service
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'], // Tu URL de RabbitMQ
          queue: 'notifications_queue', // La misma cola que escucha el servicio de notificaciones
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [AssessmentController],
  providers: [AssessmentService],
})
export class AppModule {}