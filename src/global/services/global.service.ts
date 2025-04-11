import { Injectable } from '@nestjs/common';  
import { DataSource } from 'typeorm';  
import { InjectRepository } from '@nestjs/typeorm';  
import { Repository } from 'typeorm';  
import { Provincia } from '../entities/provincia.entity';  
import { Canton } from '../entities/canton.entity'; 
import { GlobalDominios } from '../../consultoria/entities/global_dominios.entity';  


@Injectable()  
export class GlobalService {  
  constructor(
    private readonly dataSource: DataSource, 
    @InjectRepository(GlobalDominios)  
    private readonly globalDominiosRepository: Repository<GlobalDominios>,  
    @InjectRepository(Provincia)  
    private readonly provinciaRepository: Repository<Provincia>,  

    @InjectRepository(Canton)  
    private readonly cantonRepository: Repository<Canton>,  
  ) {}  

  // Obtener todas las provincias  
  async getProvincias(): Promise<Provincia[]> {  
    return this.provinciaRepository.find(); // Retorna todas las provincias  
  }  

  // Obtener cantones por provincia  
  async getCantones(id_provincial: number): Promise<Canton[]> {  
    return this.cantonRepository.find({  
      where: { id_provincia: id_provincial }, // Filtrar por id_provincial  
    });  
  } 

  async getGlobalLogos() {  
    const logos = await this.dataSource.query(`  
      SELECT     
        logo_nombre,   
        logo_ruta 
      FROM public.tbl_global_logo  
      WHERE logo_estado = 1  
    `);  

    // Opcional: Obtener dominio si lo necesitas  
    const dominio = await this.dataSource.query(`  
      SELECT dom_nombre   
      FROM public.tbl_global_dominios   
      WHERE dom_id = 1  
    `);  

    return {  
      logos,  
      dominio: dominio[0]?.dom_nombre || null  
    };  
  }  
 
}