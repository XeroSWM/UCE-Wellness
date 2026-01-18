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
    
    @Inject('NOTIFICATIONS_SERVICE') private readonly rabbitClient: ClientProxy,
  ) {}

  async create(data: any): Promise<Appointment> {
    // CORRECCIÓN: Usamos 'save' directo para evitar confusión de tipos
    // Esto guarda el objeto y devuelve la cita creada en una sola línea
    const savedAppointment = await this.appointmentRepository.save(data);

    // Enviar evento a RabbitMQ
    this.rabbitClient.emit('appointment_created', savedAppointment);

    return savedAppointment;
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentRepository.find();
  }
}