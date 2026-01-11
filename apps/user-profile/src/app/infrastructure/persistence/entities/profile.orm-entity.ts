import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('profiles')
export class ProfileOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true }) // Un usuario solo puede tener un perfil
  userId: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phoneNumber: string;

  @Column({ nullable: true })
  address: string | null;
}