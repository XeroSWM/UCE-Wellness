import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios'; // <--- 1. Importamos Axios para hablar con n8n
import { Appointment } from '../infrastructure/persistence/entities/appointment.entity'; 

@Injectable()
export class AppointmentService {
  // Esta es la dirección de tu n8n. Si está en verde (Active), usa esta URL:
  private readonly n8nWebhookUrl = 'http://localhost:5678/webhook/email';

  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  // 1. Crear Cita (MODIFICADO)
  async create(data: Partial<Appointment>): Promise<Appointment> {
    // Primero creamos y guardamos la cita en la base de datos como siempre
    const newAppointment = this.appointmentRepository.create(data);
    const savedAppointment = await this.appointmentRepository.save(newAppointment);

    // === AQUÍ ESTÁ LA MAGIA PARA EL CORREO ===
    // Una vez guardada, enviamos el aviso a n8n
    this.notifyN8n(savedAppointment); 
    
    return savedAppointment;
  }

  // Método auxiliar para enviar el correo sin bloquear la app
  private async notifyN8n(appointment: Appointment) {
    try {
      console.log('🚀 Intentando enviar notificación a n8n...');
      
      await axios.post(this.n8nWebhookUrl, {
        // Aquí puedes poner tu correo real para la prueba
        to: 'xeros100302@gmail.com', 
        subject: '📅 Confirmación de Cita - UCE Wellness',
        message: `Hola Xavier, tu cita ha sido agendada correctamente.\n\nFecha: ${appointment.date}\nID Estudiante: ${appointment.studentId}`
      });

      console.log('✅ Correo enviado a n8n exitosamente.');
    } catch (error) {
      // Si falla n8n, no queremos que falle la cita, solo mostramos el error
      console.error('⚠️ Error conectando con n8n:', error.message);
    }
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