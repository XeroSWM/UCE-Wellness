import { Controller, Get } from '@nestjs/common';

@Controller('resources')
export class AppController {
  @Get()
  findAll() {
    return [
      { id: 1, title: 'Cómo manejar la ansiedad', type: 'PDF', url: '/files/ansiedad.pdf', category: 'Salud Mental' },
      { id: 2, title: 'Técnicas de Pomodoro', type: 'VIDEO', url: '/videos/pomodoro.mp4', category: 'Estudio' },
      { id: 3, title: 'Meditación Guiada 5min', type: 'AUDIO', url: '/audio/meditacion.mp3', category: 'Mindfulness' }
    ];
  }
}