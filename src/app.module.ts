import { Module } from '@nestjs/common';  
import { AuthModule } from './auth/auth.module';  
import { UsuariosModule } from './usuarios/usuarios.module';  
import { ConfigModule, ConfigService } from '@nestjs/config';  
import { TypeOrmModule } from '@nestjs/typeorm';  
import { ConsultoriaModule } from './consultoria/consultoria.module';  
import { CalendarioModule } from './calendario/calendario.module';  
import { GlobalModule } from './global/global.module';  
import { CitasModule } from './citas/citas.module';  

import { JwtModule } from '@nestjs/jwt';  
import { PassportModule } from '@nestjs/passport';  
import { JwtStrategy } from './auth/jwt.strategy';  

@Module({  
  imports: [  
    ConfigModule.forRoot({  
      isGlobal: true,  
    }),  

    // Configuración de TypeORM - Base de Datos Principal
    TypeOrmModule.forRootAsync({  
      inject: [ConfigService],  
      useFactory: (configService: ConfigService) => ({  
        type: 'postgres',  
        host: configService.getOrThrow('POSTGRES_HOST'),  
        port: +configService.getOrThrow('POSTGRES_PORT'),  
        username: configService.getOrThrow('POSTGRES_USER'),  
        password: configService.getOrThrow('POSTGRES_PASSWORD'),  
        database: configService.getOrThrow('POSTGRES_DATABASE'),  
        autoLoadEntities: true,  
        synchronize: false,  
        // Opcional: Configura opciones de logging y otras conexiones
        logging: process.env.NODE_ENV === 'development',
      }),  
    }),  

    // Módulos de la Aplicación
    AuthModule,  
    UsuariosModule,  
    ConsultoriaModule,  
    CalendarioModule,   
    GlobalModule,
    CitasModule,   // Nuevo módulo de Citas

    // Configuraciones de Autenticación
    JwtModule.register({  
      secret: process.env.JWT_TOKEN,  
      signOptions: { expiresIn: '60m' },  
    }),  

    PassportModule.register({ defaultStrategy: 'jwt' }),  
  ],  
  providers: [JwtStrategy],  
})  
export class AppModule {}