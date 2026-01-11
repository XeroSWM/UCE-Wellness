import { Profile } from '../../domain/entities/profile.entity';
import { IProfileRepository } from '../ports/profile-repository.interface';
import { randomUUID } from 'crypto';

export class CreateProfileUseCase {
  constructor(private readonly profileRepository: IProfileRepository) {}

  async execute(userId: string, firstName: string, lastName: string, phone: string, address: string) {
    // 1. Verificamos si ya existe un perfil para este usuario
    const existingProfile = await this.profileRepository.findByUserId(userId);

    // 2. Si existe, podríamos actualizarlo (lógica simplificada: creamos/sobreescribimos)
    // Usamos el ID existente o generamos uno nuevo
    const id = existingProfile ? existingProfile.id : randomUUID();

    const profile = new Profile(
      id,
      userId,
      firstName,
      lastName,
      phone,
      address
    );

    return await this.profileRepository.save(profile);
  }
}