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

import { CitasService } from '../services/citas.service';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard'; // Ajusta según tu estructura

import { RegistroPacienteDto } from '../dtos/registro-paciente.dto';
import { ValidaUsuarioDto } from '../dtos/valida-usuario.dto';
import { HorariosDisponiblesDto } from '../dtos/horarios-disponibles.dto';


@ApiTags('Citas - Pacientes')  
@ApiBearerAuth()  
@Controller('citas')  
@UseGuards(JwtAuthGuard)  
export class CitasController {  
  constructor(private readonly citasService: CitasService) {}  

  @Get('usuario-valida-paciente')
  @ApiOperation({ 
    summary: 'Valida si un usuario está registrado como paciente',
    description: 'Recibe el usuario y devuelve si ya está registrado como paciente'
  })
  @ApiQuery({
    name: 'usuario',
    description: 'Usuario a validar',
    type: String,
    required: true
  })
  async validarPacienteUsuario(@Query('usuario') usuario: string) {
    // Validación básica del parámetro
    if (!usuario) {
      throw new HttpException(
        'El parámetro usuario es requerido', 
        HttpStatus.BAD_REQUEST
      );
    }

    return this.citasService.validarPacienteUsuario(usuario);
  }




  @Post('usuario-registrar-paciente')
  @ApiOperation({ 
    summary: 'Registra a un usuario como paciente',
    description: 'Permite registrar a un usuario como paciente'
  })
  @ApiBody({
    type: RegistroPacienteDto,
    description: 'Datos del paciente a registrar'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Paciente registrado exitosamente',
    schema: {
      type: 'object',
      properties: {
        mensaje: { type: 'string' },
        datos: { 
          type: 'object',
          properties: {
            citp_id: { type: 'number' },
            citp_cedula: { type: 'string' },
            citp_usuario: { type: 'string' }
            // Añade más propiedades según tu entidad
          }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 409, description: 'Usuario ya registrado' })
  async registrarPaciente(@Body() datosRegistro: RegistroPacienteDto) {
    return this.citasService.registrarPaciente(datosRegistro);
  }



  @Get('horarios-disponible-medico')
  @ApiOperation({ 
    summary: 'Obtiene horarios disponibles de un médico',
    description: 'Recibe el ID del médico y la fecha para mostrar horarios disponibles'
  })
  @ApiQuery({
    name: 'citm_id',
    description: 'ID del médico',
    type: Number,
    required: true
  })
  @ApiQuery({
    name: 'fecha',
    description: 'Fecha para consultar horarios (YYYY-MM-DD)',
    type: String,
    required: true
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Horarios disponibles del médico',
    schema: {
      type: 'object',
      properties: {
        Dia: { type: 'string' },
        horarios: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              hora_inicio: { type: 'string' },
              hora_fin: { type: 'string' }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Parámetros inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async obtenerHorariosDisponibles(
    @Query('citm_id') citm_id: number, 
    @Query('fecha') fecha: string
  ) {
    if (!citm_id || !fecha) {
      throw new HttpException(
        'Los parámetros citm_id y fecha son requeridos', 
        HttpStatus.BAD_REQUEST
      );
    }

    return this.citasService.obtenerHorariosDisponiblesMedico(citm_id, fecha);
  }


}