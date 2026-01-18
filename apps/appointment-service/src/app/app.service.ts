import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './infrastructure/persistence/entities/appointment.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  // 1. Agendar una nueva cita
  async create(data: Partial<Appointment>): Promise<Appointment> {
    // Aquí podrías validar disponibilidad, pero por ahora guardamos directo
    const newAppointment = this.appointmentRepository.create(data);
    return this.appointmentRepository.save(newAppointment);
  }

  // 2. Ver citas de un estudiante específico
  async findByStudent(studentId: string): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      where: { studentId },
      order: { date: 'ASC' } // Ordenar por fecha, la más próxima primero
    });
  }

  // 3. Ver todas las citas (Para el futuro panel de Doctor)
  async findAll(): Promise<Appointment[]> {
    return this.appointmentRepository.find();
  }
}