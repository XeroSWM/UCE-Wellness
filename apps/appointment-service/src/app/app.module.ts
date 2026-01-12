import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Appointment } from './infrastructure/persistence/entities/appointment.entity';
// Estos dos te darán error rojo hasta que los creemos en el siguiente paso
import { AppointmentController } from './infrastructure/controllers/appointment.controller';
import { AppointmentService } from './application/appointment.service';

@Module({
  imports: [
    // 1. Configuración de Base de Datos (PostgreSQL)
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'securepassword',
      database: 'uce_wellness_db',
      autoLoadEntities: true,
      synchronize: true, // ¡Solo en desarrollo! Crea la tabla automáticamente
    }),
    
    // 2. Registramos la Entidad
    TypeOrmModule.forFeature([Appointment]),

    // 3. Configuración de RabbitMQ (Para enviar notificaciones)
    ClientsModule.register([
      {
        name: 'NOTIFICATIONS_SERVICE', // Nombre clave para inyectarlo
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'], // Credenciales por defecto de RabbitMQ
          queue: 'notifications_queue', // Nombre de la cola
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