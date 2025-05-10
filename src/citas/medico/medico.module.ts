import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EstadoCitaController } from './controllers/estado-cita.controller';
import { EstadoCitaService } from './services/estado-cita.service';
import { EstadoCita } from './entities/estado-cita.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EstadoCita])
  ],
  controllers: [EstadoCitaController],
  providers: [EstadoCitaService]
})
export class MedicoModule {}