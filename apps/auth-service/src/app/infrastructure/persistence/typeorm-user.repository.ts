import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// 1. IMPORTANTE: Agregamos 'In' y 'Not' a los imports
import { Repository, In, Not } from 'typeorm'; 

import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../application/ports/user-repository.interface';
import { UserOrmEntity } from './entities/user.orm-entity';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly ormRepository: Repository<UserOrmEntity>
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const ormUser = await this.ormRepository.findOne({ where: { email } });
    if (!ormUser) return null;
    return this.toDomain(ormUser);
  }

  async save(user: User): Promise<User> {
    const userData: any = {
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      role: user.role,
      isActive: user.isActive,
    };

    if (user.id) {
      userData.id = user.id;
    }

    const ormUser = this.ormRepository.create(userData);
    const savedUser = await this.ormRepository.save(ormUser); // Si sale error de tipo aquí, usa 'as any' como hicimos antes
    
    // Pequeño hack por si TypeORM devuelve un array
    const result = Array.isArray(savedUser) ? savedUser[0] : savedUser;
    return this.toDomain(result);
  }

  // 3. BUSCAR DOCTORES (CORREGIDO PARA TU FRONTEND)
  async findAllByRole(role: string): Promise<User[]> {
    // EN LUGAR DE BUSCAR SOLO 'DOCTOR', BUSCAMOS A CUALQUIERA QUE NO SEA ESTUDIANTE.
    // O buscamos explícitamente las variantes que usa tu frontend.
    const rolesToFind = ['DOCTOR', 'doctor', 'specialist', 'ESPECIALISTA', 'ADMIN', 'admin'];

    const ormUsers = await this.ormRepository.find({ 
      where: { 
        role: In(rolesToFind) // <--- Busca cualquiera de estos
      } 
    });
    return ormUsers.map(ormUser => this.toDomain(ormUser));
  }

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