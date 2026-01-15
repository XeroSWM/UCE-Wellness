import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../application/ports/user-repository.interface';
import { UserOrmEntity } from './entities/user.orm-entity';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly ormRepository: Repository<UserOrmEntity>
  ) {}

  // 1. Buscar por Email
  async findByEmail(email: string): Promise<User | null> {
    const ormUser = await this.ormRepository.findOne({ where: { email } });
    if (!ormUser) return null;
    return this.toDomain(ormUser);
  }

  // 2. Guardar / Crear Usuario (Register)
  async save(user: User): Promise<User> {
    
    // Preparamos los datos
    const userData: any = {
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      role: user.role,
      isActive: user.isActive,
    };

    // LÓGICA CLAVE: Solo enviamos ID si ya existe. Si es nuevo, lo dejamos undefined.
    if (user.id) {
      userData.id = user.id;
    }

    // Creamos la entidad de TypeORM
    const ormUser = this.ormRepository.create(userData);
    
    // Guardamos en BD
    const savedUser = await this.ormRepository.save(ormUser);

    // CORRECCIÓN TYPESCRIPT: Forzamos el tipo con "as UserOrmEntity"
    // Esto elimina el error rojo de "UserOrmEntity[]"
    return this.toDomain(savedUser as UserOrmEntity);
  }

  // 3. Buscar por Rol
  async findAllByRole(role: string): Promise<User[]> {
    const ormUsers = await this.ormRepository.find({ 
      where: { role: role } 
    });
    return ormUsers.map(ormUser => this.toDomain(ormUser));
  }

  // Helper Privado
  private toDomain(ormUser: UserOrmEntity): User {
    return new User(
      ormUser.id,
      ormUser.name || 'Sin Nombre',
      ormUser.email,
      ormUser.passwordHash,
      ormUser.role as any,
      ormUser.isActive
    );
  }
}