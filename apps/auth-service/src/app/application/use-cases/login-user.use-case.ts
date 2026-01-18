import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
// 1. Importamos el DTO que acabamos de crear
import { LoginUserDto } from '../../infrastructure/controllers/dtos/login-user.dto';
// 2. CORRECCIÓN: UserRepository (sin I)
import { UserRepository } from '../ports/user-repository.interface';

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject('UserRepository') 
    private readonly userRepository: UserRepository, 
    private readonly jwtService: JwtService
  ) {}

  async execute(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findByEmail(loginUserDto.email);
    
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isMatch = await bcrypt.compare(loginUserDto.password, user.passwordHash);
    
    if (!isMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: user.id, email: user.email, role: user.role, name: user.name };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }
}