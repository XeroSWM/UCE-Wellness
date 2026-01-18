import { Controller, Post, Body, Get } from '@nestjs/common';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import { FindDoctorsUseCase } from '../../application/use-cases/find-doctors.use-case';
// Importamos los DTOs
import { LoginUserDto } from './dtos/login-user.dto';
import { RegisterUserDto } from './dtos/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly findDoctorsUseCase: FindDoctorsUseCase
  ) {}

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.loginUserUseCase.execute(loginUserDto);
  }

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.registerUserUseCase.execute(registerUserDto);
  }

  @Get('doctors')
  async getDoctors() {
    return this.findDoctorsUseCase.execute();
  }
}