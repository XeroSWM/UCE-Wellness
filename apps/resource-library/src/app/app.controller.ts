import { Controller, Get, Post, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AppService } from './app.service';

@Controller('resources') // Ruta: /api/resources
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getResources();
  }

  // SUBIDA DE ARCHIVOS
  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads', // Se guardan en la carpeta uploads de la raíz
      filename: (req, file, callback) => {
        // Generar nombre único: recurso-848392.pdf
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `recurso-${uniqueSuffix}${ext}`);
      },
    }),
  }))
  createResource(
    @UploadedFile() file: Express.Multer.File, 
    @Body() body: any
  ) {
    // Si no se sube archivo, file será undefined, manéjalo si deseas
    return this.appService.addResource(file, body);
  }
}