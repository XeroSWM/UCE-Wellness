import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Assessment, AssessmentSchema } from './infrastructure/persistence/schemas/assessment.schema';
import { AssessmentController } from './infrastructure/controllers/assessment.controller';
import { AssessmentService } from './application/assessment.service';

@Module({
  imports: [
    // CORRECCIÓN: Agregamos "admin:securepassword@" antes de localhost
    // y "?authSource=admin" al final para decirle dónde está guardado el usuario.
    MongooseModule.forRoot(
      'mongodb://admin:securepassword@localhost:27017/uce-wellness-assessments?authSource=admin'
    ),
    
    MongooseModule.forFeature([
      { name: Assessment.name, schema: AssessmentSchema }
    ]),
  ],
  controllers: [AssessmentController],
  providers: [AssessmentService],
})
export class AppModule {}