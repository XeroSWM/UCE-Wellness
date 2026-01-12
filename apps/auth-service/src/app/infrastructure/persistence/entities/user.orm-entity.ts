import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('users')
export class UserOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  // 👇 AQUÍ ESTÁ EL CAMBIO: Agregamos la columna nombre
  @Column({ nullable: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  role: string;

  @Column({ default: true })
  isActive: boolean;
}