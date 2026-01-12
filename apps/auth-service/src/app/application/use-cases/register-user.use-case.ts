import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../ports/user-repository.interface';

export class RegisterUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  // 1. 👇 Agregamos 'name' aquí en los argumentos
  async execute(name: string, email: string, password: string, role: 'STUDENT' | 'SPECIALIST' | 'ADMIN') {
    
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 2. 👇 Pasamos 'name' al crear la Entidad de Dominio
    // (Asegúrate de que tu archivo 'user.entity.ts' también acepte el nombre en esta posición)
    const newUser = new User(
      randomUUID(), 
      name,         // <--- ¡AQUÍ VA EL NOMBRE!
      email,
      passwordHash, 
      role
    );

    return await this.userRepository.save(newUser);
  }
}