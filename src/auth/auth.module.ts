import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolEntity } from './entities/rol.entity';
import { RolRutaEntity } from './entities/rol-ruta.entity';
import { RutaEntity } from './entities/ruta.entity';
import { RolUsuarioEntity } from './entities/rol-usuario.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy'; 

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], 
  imports: [
    TypeOrmModule.forFeature([
      RolEntity,
      RolRutaEntity,
      RutaEntity,
      RolUsuarioEntity,
    ]),
    JwtModule.register({
      secret: process.env.JWT_TOKEN,  // Usa tu clave secreta del archivo .env
      signOptions: { expiresIn: '600m' },  // Define la duración del token
    }),
    PassportModule,  
  ],
})
export class AuthModule {}
