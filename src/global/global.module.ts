import { Module } from '@nestjs/common';  
import { TypeOrmModule } from '@nestjs/typeorm';  
import { GlobalController } from './controllers/global.controller';  
import { GlobalService } from './services/global.service';  
import { Provincia } from './entities/provincia.entity';  
import { Canton } from './entities/canton.entity';  
import { GlobalDominios } from '../consultoria/entities/global_dominios.entity'; // Importa la entidad  

@Module({  
  imports: [  
    TypeOrmModule.forFeature([  
      Provincia,   
      Canton,   
      GlobalDominios // Añade esta línea  
    ]),   
  ],  
  controllers: [GlobalController],  
  providers: [GlobalService],  
  exports: [TypeOrmModule], // Opcional: exporta los repositorios si los necesitas en otros módulos  
})  
export class GlobalModule {}  