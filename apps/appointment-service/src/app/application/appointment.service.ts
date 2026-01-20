import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices'; // <--- Usamos esto para hablar con RabbitMQ
import { Appointment } from '../infrastructure/persistence/entities/appointment.entity';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    
    // Inyectamos el servicio con el nombre EXACTO que pusiste en tu app.module.ts
    @Inject('NOTIFICATIONS_SERVICE') private readonly client: ClientProxy,
  ) {}

  // 1. Crear Cita
  async create(data: Partial<Appointment>): Promise<Appointment> {
    // A. Guardamos en Base de Datos
    const newAppointment = this.appointmentRepository.create(data);
    const savedAppointment = await this.appointmentRepository.save(newAppointment);

    // B. Enviamos el mensaje a RabbitMQ
    // Preparamos los datos para el correo
    const payload = {
      to: 'xeros100302@gmail.com', // Correo fijo para pruebas
      subject: '📅 Cita Agendada (Vía RabbitMQ)',
      message: `Hola Xavier, se ha confirmado tu cita.\n\nFecha: ${savedAppointment.date}\nID Cita: ${savedAppointment.id}\nID Estudiante: ${savedAppointment.studentId}`
    };

    // 'notify_appointment' es el nombre del evento que escuchará el otro servicio
    this.client.emit('notify_appointment', payload);

    console.log('🐰 Mensaje enviado a la cola notifications_queue');
    
    return savedAppointment;
  }

  // 2. Ver Todas
  async findAll(): Promise<Appointment[]> {
    return this.appointmentRepository.find();
  }

  // 3. Buscar por Estudiante
  async findByStudent(studentId: string): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      where: { studentId },
      order: { date: 'ASC' }
    });
  }
}