import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('resources')
@UseInterceptors(CacheInterceptor) // <--- ¡ESTO ACTIVA REDIS!
export class AppController {
  @Get()
  findAll() {
    console.log('🐌 Consultando a la base de datos (Lento)...'); 
    // Si ves este log, es que NO usó caché. Si NO lo ves, ¡Redis respondió!
    
    return [
      { id: 1, title: 'Guía Anti-Estrés', type: 'PDF', url: '/files/stress.pdf' },
      { id: 2, title: 'Meditación', type: 'VIDEO', url: '/files/meditacion.mp4' }
    ];
  }
}