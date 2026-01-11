import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm'; // <--- 1. Importamos esto
import { IUserRepository } from '../../application/ports/user-repository.interface';
import { User } from '../../domain/entities/user.entity';
import { UserOrmEntity } from './entities/user.orm-entity';

export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    // 2. AÑADIMOS ESTE DECORADOR MÁGICO
    @InjectRepository(UserOrmEntity)
    private readonly ormRepository: Repository<UserOrmEntity>
  ) {}

  async save(user: User): Promise<User> {
    // Ahora 'this.ormRepository' ya no será undefined
    const ormUser = this.ormRepository.create(user);
    await this.ormRepository.save(ormUser);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const ormUser = await this.ormRepository.findOne({ where: { email } });
    if (!ormUser) return null;
    return new User(ormUser.id, ormUser.email, ormUser.passwordHash, ormUser.role as any, ormUser.isActive);
  }
}