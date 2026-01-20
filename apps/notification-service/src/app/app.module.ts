import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller'; // <--- Verifica que esta ruta sea "./app.controller"
import { AppService } from './app.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController], // <--- ¡TIENE QUE ESTAR AQUÍ!
  providers: [AppService],
})
export class AppModule {}
