import { Injectable, Inject, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../ports/user-repository.interface';
// Importamos el DTO correcto que acabamos de definir arriba
import { RegisterUserDto } from '../../infrastructure/controllers/dtos/register-user.dto';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject('UserRepository') 
    private readonly userRepository: UserRepository
  ) {}

  async execute(registerUserDto: RegisterUserDto): Promise<User> {
    // 1. Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findByEmail(registerUserDto.email);
    
    if (existingUser) {
      throw new ConflictException('El correo ya está registrado');
    }

    // 2. Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(registerUserDto.password, salt);

    // 3. Crear la entidad de Usuario (Dominio)
    const newUser = new User(
      null, // ID (se genera en base de datos)
      registerUserDto.name || 'Usuario Sin Nombre', // Manejo de nombre opcional
      registerUserDto.email,
      hash,
      registerUserDto.role || 'STUDENT', // Ahora .role sí existe en el DTO y no da error
      true // isActive
    );

    // 4. Guardar en Base de Datos
    return this.userRepository.save(newUser);
  }
}