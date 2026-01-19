import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  // Base de datos simulada en memoria
  private mockDatabase = [
    { 
      id: 1, 
      title: 'Guía de Ansiedad Básica', 
      type: 'PDF', 
      url: 'https://www.oriu.edu.ar/images/guia_ansiedad.pdf', // URL externa ejemplo
      category: 'Salud Mental' 
    },
    { 
      id: 2, 
      title: 'Playlist Relax', 
      type: 'AUDIO', 
      url: '#', 
      category: 'Música' 
    },
  ];

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  // --- OBTENER RECURSOS (CON REDIS) ---
  async getResources() {
    // 1. Preguntar a Redis
    const cachedData = await this.cacheManager.get('all_resources');
    
    if (cachedData) {
      this.logger.log('⚡ CACHE HIT: Datos desde Redis');
      return cachedData;
    }

    // 2. Si no hay caché, usar "Base de Datos"
    this.logger.log('🐢 CACHE MISS: Datos desde Memoria/BD');
    const data = this.mockDatabase;

    // 3. Guardar en Redis
    await this.cacheManager.set('all_resources', data);
    
    return data;
  }

  // --- AGREGAR RECURSO (LIMPIAR REDIS) ---
  async addResource(file: any, body: any) {
    // Construir la URL pública usando el puerto 3007
    // Si file existe usamos su nombre, si no, ponemos null (por si solo envían texto)
    const fileUrl = file 
      ? `http://localhost:3007/uploads/${file.filename}` 
      : '#';

    const newResource = {
      id: Date.now(),
      title: body.title || (file ? file.originalname : 'Sin título'),
      type: 'FILE', // Puedes mejorar esto detectando la extensión
      category: body.category || 'General',
      url: fileUrl
    };

    this.logger.log(`📂 Archivo guardado: ${newResource.url}`);

    // Guardar en array
    this.mockDatabase.push(newResource);

    // ¡CRÍTICO! Borrar caché para que el nuevo archivo aparezca al recargar
    await this.cacheManager.del('all_resources');
    this.logger.log('🧹 Caché invalidada');

    return newResource;
  }
}