import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserOrmEntity {
  @PrimaryGeneratedColumn('uuid') // <--- ESTO ES VITAL
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ default: 'STUDENT' })
  role: string;

  @Column({ default: true })
  isActive: boolean;
}