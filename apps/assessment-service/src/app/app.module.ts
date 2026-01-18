import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Importaciones de tus Esquemas (Asegúrate que las rutas coincidan con tu estructura)
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
      // Colección de preguntas
      { name: Assessment.name, schema: AssessmentSchema },
      
      // Colección de resultados (NUEVO - Para el historial)
      { name: AssessmentResult.name, schema: AssessmentResultSchema }
    ]),
  ],
  controllers: [AssessmentController],
  providers: [AssessmentService],
})
export class AppModule {}