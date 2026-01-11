import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt'; // <--- 1. Importamos bcrypt
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../ports/user-repository.interface';

export class RegisterUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(email: string, password: string, role: 'STUDENT' | 'SPECIALIST' | 'ADMIN') {
    
    // 2. ENCRIPTACIÓN: Convertimos "Hola123" en "$2b$10$EixZa..."
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 3. Creamos el usuario usando el HASH, no la contraseña original
    const newUser = new User(
      randomUUID(), 
      email,
      passwordHash, // <--- Aquí va el hash seguro
      role
    );

    return await this.userRepository.save(newUser);
  }
}