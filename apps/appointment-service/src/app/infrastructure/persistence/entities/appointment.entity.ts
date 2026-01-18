import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  studentId: string; // ID del estudiante (viene del Auth)

  @Column()
  professionalName: string; // Ej: "Dr. J. Guevara" (Como en tu diseño)

  @Column()
  type: string; // Ej: "Sesión de Seguimiento", "Evaluación Inicial"

  @Column()
  date: Date; // Ej: 2026-01-12 10:30:00

  @Column({ default: 'SCHEDULED' })
  status: string; // SCHEDULED, COMPLETED, CANCELLED

  @Column({ nullable: true })
  meetingLink: string; // Para el botón "Preparar Sesión" (Zoom/Teams)

  @CreateDateColumn()
  createdAt: Date;
}