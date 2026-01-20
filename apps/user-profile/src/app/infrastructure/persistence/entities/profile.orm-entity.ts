import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('profiles')
export class ProfileOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: string; // El ID que viene del Login

  @Column()
  name: string; // <--- CAMBIO: Solo un campo para "Xavier Monteros"

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  address: string | null;

  // === DATOS ACADÉMICOS ===
  @Column({ nullable: true })
  semester: string;

  @Column({ nullable: true })
  faculty: string;

  @Column({ nullable: true })
  career: string;

  @Column({ nullable: true })
  profilePicture: string; 
}