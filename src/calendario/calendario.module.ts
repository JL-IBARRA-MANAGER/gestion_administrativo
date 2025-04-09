import { Module } from '@nestjs/common';  
import { TypeOrmModule } from '@nestjs/typeorm';  
import { CalendarioController } from './controllers/calendario.controller';  
import { CalendarioService } from './services/calendario.service';  
import { GlobalCalendario } from './entities/global-calendario.entity';  

@Module({  
  imports: [  
    TypeOrmModule.forFeature([GlobalCalendario])  
  ],  
  controllers: [CalendarioController],  
  providers: [CalendarioService]  
})  
export class CalendarioModule {}  