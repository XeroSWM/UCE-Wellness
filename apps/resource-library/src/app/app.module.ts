import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { AppController } from './app.controller';

@Module({
  imports: [
    // Configuración de Redis
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: 'localhost',
            port: 6379,
          },
          ttl: 10 * 1000, // Los datos viven 10 segundos en memoria
        }),
      }),
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}