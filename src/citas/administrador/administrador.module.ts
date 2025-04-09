import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfiguracionCitasController } from './controllers/configuracion-citas.controller';  
import { ConfiguracionCitasService } from './services/configuracion-citas.service'; 
import { ConfiguracionCitas } from './entities/configuracion-citas.entity';  


@Module({
  imports: [
    TypeOrmModule.forFeature([ConfiguracionCitas])
  ],
  controllers: [ConfiguracionCitasController],
  providers: [ConfiguracionCitasService]
})
export class AdministradorModule {}