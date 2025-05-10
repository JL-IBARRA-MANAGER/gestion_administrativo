import {  
  Controller,  
  Get,  
  Put,
  Query,   
  Post,  
  Param,   
  Body,   
  UseGuards,  
  HttpException,  
  HttpStatus,  
} from '@nestjs/common';

import { 
  ApiTags, 
  ApiBearerAuth, 
  ApiOperation, 
  ApiQuery,
  ApiResponse,
  ApiBody 
} from '@nestjs/swagger';

import { EstadoCitaService } from '../services/estado-cita.service';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { EstadoCitaDto } from '../dtos/estado-cita.dto';
import { CitasMedicoDto } from '../dtos/citas-medico.dto';
import { ActualizarCitaDto } from '../dtos/actualizar-cita.dto';


@ApiTags('Citas - Médicos')  
@ApiBearerAuth()  
@Controller('medico/citas')  
@UseGuards(JwtAuthGuard)  
export class EstadoCitaController {  
  constructor(private readonly estadoCitaService: EstadoCitaService) {}  

  @Get('medico-estados-citas')
  @ApiOperation({ 
    summary: 'Obtiene todos los estados posibles de una cita',
    description: 'Devuelve una lista de estados que puede tener una cita médica'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de estados de citas',
    type: [EstadoCitaDto]
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado' 
  })
  async obtenerEstadosCitas() {
    return this.estadoCitaService.obtenerEstadosCitas();
  }



  @Get('medico-citas')
  @ApiOperation({ 
    summary: 'Obtiene citas de un médico por estado',
    description: 'Devuelve todas las citas de un médico para un estado específico'
  })
  @ApiQuery({
    name: 'citm_id',
    description: 'ID del médico',
    type: Number,
    required: true
  })
  @ApiQuery({
    name: 'cites_id',
    description: 'ID del estado de la cita',
    type: Number,
    required: true
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de citas del médico',
    type: [CitasMedicoDto]
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado' 
  })
  async obtenerCitasMedico(
    @Query('citm_id') citm_id: number, 
    @Query('cites_id') cites_id: number
  ) {
    // Validación de parámetros
    if (!citm_id || !cites_id) {
      throw new HttpException(
        'Los parámetros citm_id y cites_id son requeridos', 
        HttpStatus.BAD_REQUEST
      );
    }

    return this.estadoCitaService.obtenerCitasMedico(citm_id, cites_id);
  }



  @Put('medico-cita-actualizar')
  @ApiOperation({ 
    summary: 'Actualiza el estado de una cita médica',
    description: 'Permite actualizar el estado de una cita específica'
  })
  @ApiBody({
    type: ActualizarCitaDto,
    description: 'Datos para actualizar el estado de la cita'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Cita actualizada exitosamente'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Cita no encontrada' 
  })
  async actualizarEstadoCita(
    @Body() datosActualizacion: ActualizarCitaDto
  ) {
    // Validación de parámetros
    if (!datosActualizacion.citmed_id || !datosActualizacion.cites_id) {
      throw new HttpException(
        'Los parámetros citmed_id y cites_id son requeridos', 
        HttpStatus.BAD_REQUEST
      );
    }

    return this.estadoCitaService.actualizarEstadoCita(
      datosActualizacion.citmed_id, 
      datosActualizacion.cites_id
    );
  }


}