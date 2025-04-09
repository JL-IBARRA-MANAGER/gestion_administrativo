import { Injectable } from '@nestjs/common';  
import { InjectRepository } from '@nestjs/typeorm';  
import { Repository } from 'typeorm';  
import { Provincia } from '../entities/provincia.entity';  
import { Canton } from '../entities/canton.entity';  

@Injectable()  
export class GlobalService {  
  constructor(  
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
}