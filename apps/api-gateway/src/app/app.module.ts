import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';

@Module({
  imports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    
    // ----------------------------------------------------------------
    // ESTRATEGIA: TRANSPARENTE
    // Enviamos la ruta completa '/api/auth/register' al microservicio
    // porque NestJS (Nx) usa el prefijo 'api' por defecto.
    // ----------------------------------------------------------------

    // 1. AUTH SERVICE -> Puerto 3000
    consumer
      .apply(
        createProxyMiddleware({
          target: 'http://localhost:3000',
          changeOrigin: true,
          // ❌ BORRAMOS pathRewrite. ¡No queremos cambiar nada!
        })
      )
      .forRoutes({ path: 'api/auth/*', method: RequestMethod.ALL });

    // 2. PROFILES SERVICE -> Puerto 3001
    consumer
      .apply(
        createProxyMiddleware({
          target: 'http://localhost:3001',
          changeOrigin: true,
        })
      )
      .forRoutes({ path: 'api/profiles/*', method: RequestMethod.ALL });

    // 3. ASSESSMENTS -> Puerto 3002
    consumer
      .apply(
        createProxyMiddleware({
          target: 'http://localhost:3002',
          changeOrigin: true,
        })
      )
      .forRoutes({ path: 'api/assessments/*', method: RequestMethod.ALL });

    // 4. APPOINTMENTS -> Puerto 3003
    consumer
      .apply(
        createProxyMiddleware({
          target: 'http://localhost:3003',
          changeOrigin: true,
        })
      )
      .forRoutes({ path: 'api/appointments/*', method: RequestMethod.ALL });

    // 5. RESOURCES -> Puerto 3007
    consumer
      .apply(
        createProxyMiddleware({
          target: 'http://localhost:3007',
          changeOrigin: true,
        })
      )
      .forRoutes({ path: 'api/resources/*', method: RequestMethod.ALL });
  }
}