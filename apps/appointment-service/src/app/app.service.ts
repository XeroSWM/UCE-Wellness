import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Asegúrate de que la ruta a tu entidad sea correcta
import { Appointment } from './infrastructure/persistence/entities/appointment.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  // 1. Agendar una nueva cita (POST)
  async create(data: Partial<Appointment>): Promise<Appointment> {
    // Creamos la instancia y la guardamos
    const newAppointment = this.appointmentRepository.create(data);
    return this.appointmentRepository.save(newAppointment);
  }

  // 2. Ver citas de un ESTUDIANTE (GET /student/:id)
  // Este es el que usa tu Dashboard actual
  async findByStudent(studentId: string): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      where: { studentId },    // Filtra por el ID del estudiante
      order: { date: 'ASC' }   // Ordena por fecha (la más próxima arriba)
    });
  }


  // 4. Ver todas las citas (GET)
  // Útil para depuración o para un panel de Administrador
  async findAll(): Promise<Appointment[]> {
    return this.appointmentRepository.find();
  }
}