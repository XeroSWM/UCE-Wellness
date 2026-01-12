import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../application/ports/user-repository.interface';
import { UserOrmEntity } from './entities/user.orm-entity';

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly ormRepository: Repository<UserOrmEntity>
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const ormUser = await this.ormRepository.findOne({ where: { email } });
    if (!ormUser) return null;

    // 👇 CORRECCIÓN 1: Agregamos ormUser.name en la segunda posición
    return new User(
      ormUser.id,
      ormUser.name || 'Sin Nombre', // <--- ¡AQUÍ ESTABA EL ERROR!
      ormUser.email,
      ormUser.passwordHash,
      ormUser.role as any,
      ormUser.isActive
    );
  }

  async save(user: User): Promise<User> {
    // 1. Guardar en BD (Mapeo de Dominio a ORM)
    const ormUser = this.ormRepository.create({
      id: user.id,
      name: user.name, // <--- Aseguramos guardar el nombre
      email: user.email,
      passwordHash: user.passwordHash,
      role: user.role,
      isActive: user.isActive,
    });
    
    await this.ormRepository.save(ormUser);

    // 2. Devolver al Dominio (Mapeo de ORM a Dominio)
    // 👇 CORRECCIÓN 2: Agregamos ormUser.name aquí también
    return new User(
      ormUser.id,
      ormUser.name || 'Sin Nombre', // <--- ¡AQUÍ TAMBIÉN!
      ormUser.email,
      ormUser.passwordHash,
      ormUser.role as any,
      ormUser.isActive
    );
  }
}