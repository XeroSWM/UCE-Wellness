import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 1. AUTH (Igual que antes)
    consumer
      .apply(
        createProxyMiddleware({
          target: 'http://localhost:3000',
          changeOrigin: true,
          pathRewrite: { '^/': '/api/auth/' },
        })
      )
      .forRoutes('api/auth');

    // 2. PROFILES (Ahora apuntamos a /api/profiles)
    consumer
      .apply(
        createProxyMiddleware({
          target: 'http://localhost:3001',
          changeOrigin: true,
          // REGLA NUEVA: Reconstruimos la ruta con /api
          pathRewrite: { 
            '^/': '/api/profiles/', 
          },
        })
      )
      .forRoutes('api/profiles');
    // 3. REGLA: Assessments (Tests Psicológicos) -> Puerto 3002
    consumer
      .apply(
        createProxyMiddleware({
          target: 'http://localhost:3002',
          changeOrigin: true,
          pathRewrite: { 
            '^/': '/api/assessments/', 
          },
        })
      )
      .forRoutes('api/assessments');

    // 4. CITAS MÉDICAS -> Puerto 3003
    consumer
      .apply(
        createProxyMiddleware({
          target: 'http://localhost:3003',
          changeOrigin: true,
          pathRewrite: { 
            '^/': '/api/appointments/', 
          },
        })
      )
      .forRoutes('api/appointments');
  }
}