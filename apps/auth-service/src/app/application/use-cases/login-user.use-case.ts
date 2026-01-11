import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, Injectable } from '@nestjs/common';
import { IUserRepository } from '../ports/user-repository.interface';

@Injectable()
export class LoginUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService
  ) {}

  async execute(email: string, password: string) {
    // 1. Buscar al usuario
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 2. Comparar contraseña (Texto plano vs Hash)
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 3. Generar el Token (JWT)
    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token, // Este es el "pase" para entrar al sistema
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      }
    };
  }
}