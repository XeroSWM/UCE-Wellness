import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileOrmEntity } from './infrastructure/persistence/entities/profile.orm-entity';
import { TypeOrmProfileRepository } from './infrastructure/persistence/typeorm-profile.repository';
import { ProfileController } from './infrastructure/controllers/profile.controller'; // <--- IMPORTAR

@Module({
  imports: [
    // 1. Conexión a PostgreSQL (Misma configuración que Auth-Service)
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'securepassword',
      database: 'uce_wellness_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    // 2. Registramos la entidad de Perfil
    TypeOrmModule.forFeature([ProfileOrmEntity]),
  ],
  controllers: [ProfileController], 
  providers: [
    // 3. Inyección de Dependencia
    {
      provide: 'IProfileRepository',
      useClass: TypeOrmProfileRepository,
    },
  ],
})
export class AppModule {}