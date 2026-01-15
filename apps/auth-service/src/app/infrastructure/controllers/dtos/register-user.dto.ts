import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  // 👇 ESTE ES EL CAMPO QUE FALTA Y CAUSA EL ERROR ROJO
  @IsString()
  @IsOptional()
  role?: string; 
}