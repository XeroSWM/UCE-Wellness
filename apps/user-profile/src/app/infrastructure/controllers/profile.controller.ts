import { Controller, Post, Body, Inject, Get, Param } from '@nestjs/common';
import { CreateProfileUseCase } from '../../application/use-cases/create-profile.use-case';
import { IProfileRepository } from '../../application/ports/profile-repository.interface';

@Controller('profiles') // Ruta: http://localhost:3001/api/profiles
export class ProfileController {
  private createProfileUseCase: CreateProfileUseCase;

  constructor(
    @Inject('IProfileRepository') private readonly profileRepository: IProfileRepository
  ) {
    this.createProfileUseCase = new CreateProfileUseCase(this.profileRepository);
  }

  @Post()
  async create(@Body() body: any) {
    const { userId, firstName, lastName, phoneNumber, address } = body;
    return await this.createProfileUseCase.execute(userId, firstName, lastName, phoneNumber, address);
  }

  @Get(':userId')
  async getByUserId(@Param('userId') userId: string) {
    return await this.profileRepository.findByUserId(userId);
  }
}