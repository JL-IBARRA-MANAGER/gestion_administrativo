import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CitasService } from './services/citas.service';
import { CitasController } from './controllers/citas.controller';
import { CitasPaciente } from './entities/citas-paciente.entity'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([CitasPaciente])
  ],
  controllers: [CitasController],
  providers: [CitasService]
})
export class PacienteModule {}