import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { Telemetry, TelemetrySchema } from './infrastructure/persistence/schemas/telemetry.schema';
import { AnalyticsService } from './application/analytics.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forRoot('mongodb://admin:securepassword@localhost:27017/uce-wellness-telemetry?authSource=admin'),
    MongooseModule.forFeature([{ name: Telemetry.name, schema: TelemetrySchema }]),
  ],
  controllers: [],
  providers: [AnalyticsService],
})
export class AppModule {}