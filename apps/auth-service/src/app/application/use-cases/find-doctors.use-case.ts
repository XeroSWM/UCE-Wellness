import { Injectable, Inject } from '@nestjs/common';
import { UserRepository } from '../ports/user-repository.interface';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class FindDoctorsUseCase {
  constructor(
    // Inyectamos la interfaz, no la implementación (Dependency Inversion)
    @Inject('UserRepository') 
    private readonly userRepository: UserRepository
  ) {}

  async execute(): Promise<User[]> {
    // Buscamos a todos los que tengan el rol 'DOCTOR'
    return this.userRepository.findAllByRole('DOCTOR');
  }
}