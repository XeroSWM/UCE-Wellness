import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IProfileRepository } from '../../application/ports/profile-repository.interface';
import { Profile } from '../../domain/entities/profile.entity';
import { ProfileOrmEntity } from './entities/profile.orm-entity';

export class TypeOrmProfileRepository implements IProfileRepository {
  constructor(
    @InjectRepository(ProfileOrmEntity)
    private readonly ormRepository: Repository<ProfileOrmEntity>
  ) {}

  async save(profile: Profile): Promise<Profile> {
    const ormProfile = this.ormRepository.create(profile);
    await this.ormRepository.save(ormProfile);
    return profile;
  }

  async findByUserId(userId: string): Promise<Profile | null> {
    const ormProfile = await this.ormRepository.findOne({ where: { userId } });
    if (!ormProfile) return null;
    return new Profile(
      ormProfile.id,
      ormProfile.userId,
      ormProfile.firstName,
      ormProfile.lastName,
      ormProfile.phoneNumber,
      ormProfile.address
    );
  }
}