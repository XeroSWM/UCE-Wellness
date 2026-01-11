import { Profile } from '../../domain/entities/profile.entity';

export interface IProfileRepository {
  save(profile: Profile): Promise<Profile>;
  findByUserId(userId: string): Promise<Profile | null>;
}