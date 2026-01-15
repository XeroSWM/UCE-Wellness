import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

// Controllers
import { AuthController } from './infrastructure/controllers/auth.controller';

// Entidades
import { UserOrmEntity } from './infrastructure/persistence/entities/user.orm-entity';

// Repositorios
import { TypeOrmUserRepository } from './infrastructure/persistence/typeorm-user.repository';

// Strategies
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';

// Use Cases (AQUÍ ESTÁ LA CLAVE: Deben estar importados los 3)
import { LoginUserUseCase } from './application/use-cases/login-user.use-case';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { FindDoctorsUseCase } from './application/use-cases/find-doctors.use-case';

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
    TypeOrmModule.forFeature([UserOrmEntity]),

    // 2. Configuración de JWT
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'ESTA_ES_LA_CLAVE_SECRETA', // Asegúrate de usar la misma clave que en JwtStrategy
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    // 3. REGISTRO DE CASOS DE USO (¡Faltaba LoginUserUseCase aquí!)
    LoginUserUseCase,
    RegisterUserUseCase,
    FindDoctorsUseCase,

    // 4. Estrategias
    JwtStrategy,

    // 5. Inyección del Repositorio
    {
      provide: 'UserRepository',
      useClass: TypeOrmUserRepository,
    },
  ],
})
export class AppModule {}