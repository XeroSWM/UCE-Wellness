import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // 1. Extraer el token de la cabecera "Authorization: Bearer <token>"
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // 2. IMPORTANTE: Debe ser la misma clave secreta que usaste en AppModule
      secretOrKey: 'CLAVE_SECRETA_SUPER_SEGURA', 
    });
  }

  // 3. Si el token es válido, esto añade los datos del usuario a la petición
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}