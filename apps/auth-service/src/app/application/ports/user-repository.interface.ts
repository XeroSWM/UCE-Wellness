import { User } from '../../domain/entities/user.entity';

// CORRECCIÓN: Le quitamos la 'I' para que coincida con el resto del proyecto
export interface UserRepository {
  save(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findAllByRole(role: string): Promise<User[]>;
}