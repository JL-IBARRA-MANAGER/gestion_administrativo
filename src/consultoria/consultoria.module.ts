import { Module } from '@nestjs/common';  
import { TypeOrmModule } from '@nestjs/typeorm';  
import { ConsultoriaController } from './controllers/consultoria.controller';  
import { ConsultoriaService } from './services/consultoria.service';  
import { ConsultoriaCliente } from './entities/consultoria-cliente.entity';  
import { ConsultoriaDependencia } from './entities/consultoria-dependencia.entity';  
import { ConsultoriaRegistroEstado } from './entities/tbl-consultoria-registro-estado.entity';  
import { ConsultoriaRegistro } from './entities/tbl-consultoria-registro.entity';  
import { GlobalDominios } from './entities/global_dominios.entity';  
import { ConsultoriaRegistroDetalle } from './entities/tbl-consultoria-registro-detalle.entity';

@Module({  
  imports: [  
    TypeOrmModule.forFeature([  
      ConsultoriaCliente,  
      ConsultoriaDependencia,  
      ConsultoriaRegistroEstado,  
      ConsultoriaRegistro,  
      GlobalDominios,  
      ConsultoriaRegistroDetalle,
    ]),  
  ],  
  controllers: [ConsultoriaController],  
  providers: [ConsultoriaService],  
})  
export class ConsultoriaModule {}