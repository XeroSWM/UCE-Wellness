import { Profile } from '../../domain/entities/profile.entity';
import { IProfileRepository } from '../ports/profile-repository.interface';
import { randomUUID } from 'crypto';

export class CreateProfileUseCase {
  constructor(private readonly profileRepository: IProfileRepository) {}

  async execute(userId: string, data: any) {
    const existingProfile = await this.profileRepository.findByUserId(userId);
    const id = existingProfile ? existingProfile.id : randomUUID();

    // Creamos el perfil usando data.name
    const profile = new Profile(
      id,
      userId,
      data.name, // <--- CAMBIO: Usamos el nombre completo que viene del front
      data.phoneNumber || null,
      data.address || null,
      data.semester || null,
      data.faculty || null,
      data.career || null,
      data.profilePicture || null
    );

    return await this.profileRepository.save(profile);
  }
}