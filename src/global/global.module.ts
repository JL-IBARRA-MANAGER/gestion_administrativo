import { Module } from '@nestjs/common';  
import { TypeOrmModule } from '@nestjs/typeorm';  
import { GlobalController } from './controllers/global.controller';  
import { GlobalService } from './services/global.service';  
import { Provincia } from './entities/provincia.entity';  
import { Canton } from './entities/canton.entity';  

@Module({  
  imports: [  
    TypeOrmModule.forFeature([Provincia, Canton]), // Entidades registradas para TypeORM  
  ],  
  controllers: [GlobalController],  
  providers: [GlobalService],  
  exports: [], // Exporta servicios si otros módulos los necesitan  
})  
export class GlobalModule {}