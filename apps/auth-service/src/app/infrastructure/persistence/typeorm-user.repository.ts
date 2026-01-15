import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Imports de tu dominio e infraestructura
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../application/ports/user-repository.interface'; // Nota: En tu proyecto se llama UserRepository
import { UserOrmEntity } from './entities/user.orm-entity';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly ormRepository: Repository<UserOrmEntity>
  ) {}

  // 1. Buscar por Email (Login)
  async findByEmail(email: string): Promise<User | null> {
    const ormUser = await this.ormRepository.findOne({ where: { email } });
    if (!ormUser) return null;

    // Usamos el helper para aplicar la corrección del nombre
    return this.toDomain(ormUser);
  }

  // 2. Guardar / Crear Usuario (Register)
  async save(user: User): Promise<User> {
    // Mapeo Dominio -> ORM
    const ormUser = this.ormRepository.create({
      id: user.id,
      name: user.name, // Aseguramos guardar el nombre
      email: user.email,
      passwordHash: user.passwordHash,
      role: user.role,
      isActive: user.isActive,
    });
    
    const savedUser = await this.ormRepository.save(ormUser);

    // Mapeo ORM -> Dominio (con corrección)
    return this.toDomain(savedUser);
  }

  // 3. Buscar por Rol (Para la lista de Doctores en Citas)
  async findAllByRole(role: string): Promise<User[]> {
    const ormUsers = await this.ormRepository.find({ 
      where: { role: role } 
    });

    // Mapeamos todos los doctores encontrados
    return ormUsers.map(ormUser => this.toDomain(ormUser));
  }

  // --- HELPER PRIVADO (MApeo ORM a Dominio) ---
  // Centralizamos la lógica aquí para no repetir el 'Sin Nombre' en todos lados
  private toDomain(ormUser: UserOrmEntity): User {
    return new User(
      ormUser.id,
      ormUser.name || 'Sin Nombre', // <--- ¡AQUÍ ESTÁ LA CORRECCIÓN CLAVE!
      ormUser.email,
      ormUser.passwordHash,
      ormUser.role as any,
      ormUser.isActive
    );
  }
}