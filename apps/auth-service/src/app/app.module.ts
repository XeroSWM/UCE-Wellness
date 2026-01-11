import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { UserOrmEntity, TypeOrmUserRepository } from './infrastructure/persistence';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy'; // <--- Importamos la estrategia
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    // 1. Configuración de Base de Datos
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
    // 2. Entidades de este módulo
    TypeOrmModule.forFeature([UserOrmEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // 3. Configuración JWT (El "Sello" de seguridad)
    JwtModule.register({
      global: true,
      secret: 'CLAVE_SECRETA_SUPER_SEGURA', // En producción esto va en variables de entorno (.env)
      signOptions: { expiresIn: '1h' }, // El token expira en 1 hora
    }),
  ],
  controllers: [AuthController],
  providers: [
    // 4. Inyección del Repositorio
    {
      provide: 'IUserRepository',
      useClass: TypeOrmUserRepository,
    },
    // 5. Inyección de la Estrategia (El "Portero")
    JwtStrategy, 
  ],
})
export class AppModule {}