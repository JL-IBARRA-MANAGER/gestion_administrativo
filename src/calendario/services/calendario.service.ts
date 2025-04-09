import { Injectable } from '@nestjs/common';  
import { InjectRepository } from '@nestjs/typeorm';  
import { Repository } from 'typeorm';  
import { GlobalCalendario } from '../entities/global-calendario.entity';   
import { GlobalCalendarioDto } from '../dtos/global-calendario.dto';     

@Injectable()  
export class CalendarioService {  
  constructor(  
    @InjectRepository(GlobalCalendario)  
    private readonly globalCalendarioRepository: Repository<GlobalCalendario>,  
  ) {}  

  async getHorarioGeneral(): Promise<GlobalCalendarioDto> {  
    const query = `  
      SELECT gcal_hora_inicio, gcal_hora_fin  
      FROM public.tbl_global_calendario  
      LIMIT 1  
    `;  
    
    const result = await this.globalCalendarioRepository.query(query);  
    
    return result[0] ? {  
      gcal_hora_inicio: result[0].gcal_hora_inicio,  
      gcal_hora_fin: result[0].gcal_hora_fin  
    } : null;  
  }  
}