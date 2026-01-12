import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Appointment } from '../infrastructure/persistence/entities/appointment.entity';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    
    // Inyectamos el cliente de RabbitMQ que configuramos en el Module
    @Inject('NOTIFICATIONS_SERVICE') private readonly rabbitClient: ClientProxy,
  ) {}

  async create(data: any): Promise<Appointment> {
    // 1. Guardar en PostgreSQL
    const newAppointment = this.appointmentRepository.create(data);
    const savedAppointment = await this.appointmentRepository.save(newAppointment);

    // 2. Enviar evento a RabbitMQ (Asíncrono)
    // El primer argumento 'appointment_created' es el "Nombre del Evento"
    this.rabbitClient.emit('appointment_created', savedAppointment);

    return savedAppointment;
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentRepository.find();
  }
}