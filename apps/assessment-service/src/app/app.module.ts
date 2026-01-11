import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Assessment, AssessmentSchema } from './infrastructure/persistence/schemas/assessment.schema';
import { AssessmentController } from './infrastructure/controllers/assessment.controller';
import { AssessmentService } from './application/assessment.service';

@Module({
  imports: [
    // 1. Conexión a la Base de Datos MongoDB (Contenedor Docker)
    MongooseModule.forRoot('mongodb://localhost:27017/uce-wellness-assessments'),
    
    // 2. Registro del Esquema (Schema) para que NestJS pueda guardar datos
    MongooseModule.forFeature([
      { name: Assessment.name, schema: AssessmentSchema }
    ]),
  ],
  controllers: [AssessmentController],
  providers: [AssessmentService],
})
export class AppModule {}