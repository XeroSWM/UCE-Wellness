import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsOptional() // Lo ponemos opcional para que no falle si alguien no lo envía
  name: string;  // <--- ¡AGREGA ESTO!

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}