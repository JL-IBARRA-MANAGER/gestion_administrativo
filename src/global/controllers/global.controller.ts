import { Controller, Get, Query } from '@nestjs/common';  
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';  
import { GlobalService } from '../services/global.service';  

@ApiTags('Global') // Etiqueta para la documentación de Swagger  
@Controller('global')  
export class GlobalController {  
  constructor(private readonly globalService: GlobalService) {}  

  // Endpoint: Obtener todas las provincias  
  @Get('global-provincias')  
  @ApiOperation({ summary: 'Obtiene todas las provincias del Ecuador' })  
  async getProvincias() {  
    return this.globalService.getProvincias();  
  }  

  // Endpoint: Obtener cantones por provincia  
  @Get('global-cantones')  
  @ApiOperation({ summary: 'Obtiene los cantones por provincia' })  
  @ApiQuery({ name: 'id_provincial', required: true, example: 1 })  
  async getCantones(@Query('id_provincial') id_provincial: number) {  
    return this.globalService.getCantones(id_provincial);  
  }  
}