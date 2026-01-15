import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

// Usamos el nombre 'RegisterUserDto' para que coincida con el controlador
export class RegisterUserDto {
  @IsString()
  @IsOptional()
  name: string; // Nombre del usuario (Opcional, pero recomendado)

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  // AGREGADO: Campo 'role' opcional para que TypeScript no se queje en el Caso de Uso
  @IsString()
  @IsOptional()
  role?: string;
}