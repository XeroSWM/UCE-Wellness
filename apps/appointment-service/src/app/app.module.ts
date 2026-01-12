import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Appointment } from './infrastructure/persistence/entities/appointment.entity';
import { AppointmentController } from './infrastructure/controllers/appointment.controller';
// CORRECCIÓN: Importamos directo desde application
import { AppointmentService } from './application/appointment.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'securepassword',
      database: 'uce_wellness_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Appointment]),
    ClientsModule.register([
      {
        name: 'NOTIFICATIONS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'],
          queue: 'notifications_queue',
          queueOptions: {
            durable: false
          },
        },
      },
    ]),
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
})
export class AppModule {}