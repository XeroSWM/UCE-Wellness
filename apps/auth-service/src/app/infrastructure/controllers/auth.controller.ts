import { Controller, Post, Body, Inject, HttpCode, HttpStatus, Get, UseGuards, Request } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport'; // <--- Ahora sí funcionará esta línea
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import { IUserRepository } from '../../application/ports/user-repository.interface';

@Controller('auth')
export class AuthController {
  private registerUserUseCase: RegisterUserUseCase;
  private loginUserUseCase: LoginUserUseCase;

  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService 
  ) {
    // Inicializamos los casos de uso
    this.registerUserUseCase = new RegisterUserUseCase(this.userRepository);
    this.loginUserUseCase = new LoginUserUseCase(this.userRepository, this.jwtService);
  }

  // 1. REGISTRO (Público)
  @Post('register')
  async register(@Body() body: any) {
    const { email, password, role } = body;
    return await this.registerUserUseCase.execute(email, password, role);
  }

  // 2. LOGIN (Público) - Devuelve el Token
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: any) {
    const { email, password } = body;
    return await this.loginUserUseCase.execute(email, password);
  }

  // 3. PERFIL (Privado) - Requiere Token válido
  @UseGuards(AuthGuard('jwt')) // <--- El Portero de Seguridad
  @Get('profile')
  getProfile(@Request() req) {
    return {
      message: '¡Acceso autorizado a zona segura!',
      user_data: req.user, // Datos desencriptados del token
    };
  }
}