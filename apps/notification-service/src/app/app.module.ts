import { Module } from '@nestjs/common';
import { NotificationController } from './infrastructure/controllers/notification.controller';
import { NotificationService } from './application/notification.service';

@Module({
  imports: [],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class AppModule {}