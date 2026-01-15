import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';

// 1. Importamos la Entidad
import { Appointment } from './infrastructure/persistence/entities/appointment.entity';

// 2. Importamos el Controlador (Infraestructura)
import { AppointmentController } from './infrastructure/controllers/appointment.controller';

// 3. Importamos el Servicio (Aplicación)
import { AppointmentService } from './application/appointment.service';

@Module({
  imports: [
    // A. Conexión a Base de Datos (PostgreSQL)
    // Estos datos coinciden con tu docker-compose
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'securepassword',
      database: 'uce_wellness_db',
      autoLoadEntities: true,
      synchronize: true, // Solo para desarrollo (crea tablas auto)
    }),

    // B. Registro de la Entidad para usar Repository<Appointment>
    TypeOrmModule.forFeature([Appointment]),

    // C. Conexión a RabbitMQ (Para enviar Notificaciones)
    ClientsModule.register([
      {
        name: 'NOTIFICATIONS_SERVICE', // Nombre para inyectar luego
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'],
          queue: 'notifications_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
})
export class AppModule {}