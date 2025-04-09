import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Importaciones de Módulos
import { PacienteModule } from './paciente/paciente.module';
import { MedicoModule } from './medico/medico.module';
import { AdministradorModule } from './administrador/administrador.module';

// Importaciones de Entidades
import { ConfiguracionCitas } from './administrador/entities/configuracion-citas.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ConfiguracionCitas
    ]),
    PacienteModule,
    MedicoModule,
    AdministradorModule
  ],
  controllers: [],
  providers: []
})
export class CitasModule {}