import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../infrastructure/persistence/entities/appointment.entity'; 
// (Asegúrate que la ruta de la entidad Appointment sea correcta)

@Injectable()
export class AppointmentService { // <--- ¡OJO AQUÍ! Debe llamarse AppointmentService
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  // 1. Crear
  async create(data: Partial<Appointment>): Promise<Appointment> {
    const newAppointment = this.appointmentRepository.create(data);
    return this.appointmentRepository.save(newAppointment);
  }

  // 2. Ver Todas
  async findAll(): Promise<Appointment[]> {
    return this.appointmentRepository.find();
  }

  // 3. Buscar por Estudiante (ESTE ES EL QUE TE FALTABA O TENÍA OTRO NOMBRE)
  async findByStudent(studentId: string): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      where: { studentId },
      order: { date: 'ASC' }
    });
  }


}