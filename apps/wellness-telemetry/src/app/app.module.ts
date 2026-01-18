import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Telemetry, TelemetrySchema } from './infrastructure/persistence/schemas/telemetry.schema';
import { TelemetryController } from './infrastructure/controllers/telemetry.controller';
import { TelemetryService } from './application/telemetry.service';

@Module({
  imports: [
    // Conexión a MongoDB
    MongooseModule.forRoot('mongodb://admin:securepassword@localhost:27017/uce-wellness-telemetry?authSource=admin'),
    
    // Registro del Schema
    MongooseModule.forFeature([{ name: Telemetry.name, schema: TelemetrySchema }]),
  ],
  controllers: [TelemetryController],
  providers: [TelemetryService],
})
export class AppModule {}