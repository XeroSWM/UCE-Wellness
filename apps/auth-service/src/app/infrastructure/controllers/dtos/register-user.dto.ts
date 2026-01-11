import { UserRole } from '../../../domain/entities/user.entity';

export class RegisterUserDto {
  email!: string;
  password!: string;
  role!: UserRole;
}
