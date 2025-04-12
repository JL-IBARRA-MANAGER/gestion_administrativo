import {   
  Controller,   
  Get,   
  Put,
  Query,   
  Post,  
  Param,   
  Body   
} from '@nestjs/common';  
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';  
import { ConfiguracionCitasService } from '../services/configuracion-citas.service';  
import { ActualizarConfiguracionCitasDto } from '../dtos/actualizar-configuracion-citas.dto';  
import { CrearDiaNoLaboralDto } from '../dtos/crear-dia-no-laboral.dto';  
import { ActualizarDiaNoLaboralDto } from '../dtos/actualizar-dia-no-laboral.dto';  
import { CrearEspecialidadDto } from '../dtos/crear-especialidad.dto'; 
import { CrearAreaConocimientoDto } from '../dtos/crear-area-conocimiento.dto'; 



@ApiTags('Administrador - Configuración de Citas')  
@Controller('administrador/citas-configuracion')  
export class ConfiguracionCitasController {  
  constructor(  
    private readonly configuracionService: ConfiguracionCitasService  
  ) {}  

  // Endpoints de horario estándar  
  @Get('horario')  
  @ApiOperation({ summary: 'Obtener configuración estándar del horario' })  
  async obtenerConfiguracionHorario() {  
    return this.configuracionService.obtenerConfiguracionHorario();  
  }  

  @Put('horario/:citcId')  
  @ApiOperation({ summary: 'Actualizar configuración estándar del horario' })  
  @ApiBody({  
    description: 'Datos para actualizar la configuración del horario',  
    schema: {  
      example: {  
        tiempoMaximoCita: 30,  
        intervaloCita: 15,  
        horaInicio: '08:00',  
        horaFin: '18:00'  
      }  
    }  
  })  
  async actualizarConfiguracionHorario(  
    @Param('citcId') citcId: number,  
    @Body() datosActualizacion: ActualizarConfiguracionCitasDto  
  ) {  
    return this.configuracionService.actualizarConfiguracionHorario(citcId, datosActualizacion);  
  }   

  // Endpoints de días estándar  
  @Get('dias')  
  @ApiOperation({ summary: 'Obtener configuración de días estándar' })  
  async obtenerConfiguracionDias() {  
    return this.configuracionService.obtenerConfiguracionDias();  
  }  

  // Endpoints de días no laborables  
  @Get('feriados')  
  @ApiOperation({ summary: 'Listar días no laborables activos' })  
  async obtenerDiasNoLaborables() {  
    return this.configuracionService.obtenerDiasNoLaborables();  
  }  

  @Post('feriados')  
  @ApiOperation({ summary: 'Crear nuevo día no laborable' })  
  async crearDiaNoLaboral(  
    @Body() dto: CrearDiaNoLaboralDto  
  ) {  
    return this.configuracionService.crearDiaNoLaboral(dto);  
  }  

  @Put('feriados/:citdnlId')  
  @ApiOperation({ summary: 'Cambiar estado de día no laborable' })  
  @ApiBody({  
    description: 'Cambiar estado del día no laborable',  
    schema: {  
      example: {}  
    }  
  })  
  async cambiarEstadoDiaNoLaboral(  
    @Param('citdnlId') citdnlId: number  
  ) {  
    return this.configuracionService.cambiarEstadoDiaNoLaboral(citdnlId);  
  }  

  @Put('feriados/editar/:citdnlId')  
  @ApiOperation({ summary: 'Editar día no laborable o el detalle' })  
  @ApiBody({  
    description: 'Datos para editar el día no laborable (fecha o descripción, o ambos)',  
    schema: {  
      example: {  
        fecha: '2024-12-25',  
        descripcion: 'Navidad'  
      }  
    }  
  })  
  async editarDiaNoLaboral(  
    @Param('citdnlId') citdnlId: number,  
    @Body() dto: ActualizarDiaNoLaboralDto  
  ) {  
    return this.configuracionService.editarDiaNoLaboral(citdnlId, dto);  
  }    

  @Get('citas-areas-conocimiento')  
  @ApiOperation({ summary: 'Muestra todas las áreas del conocimiento que se manejan' })  
  async obtenerAreasConocimiento() {  
    return this.configuracionService.obtenerAreasConocimiento();  
  }  

  // Método POST para crear área de conocimiento  
  @Post('citas-areas-conocimiento')  
  @ApiOperation({ summary: 'Agrega una nueva área de conocimiento' })  
  @ApiBody({   
    type: CrearAreaConocimientoDto,  
    examples: {  
      default: {  
        value: {  
          citac_nombre: 'Medicina',  
          citac_descripcion: 'Área dedicada al estudio del cuerpo humano, enfermedades y tratamientos'  
        }  
      }  
    }  
  })  
  async crearAreaConocimiento(@Body() areaConocimientoDto: CrearAreaConocimientoDto) {  
    return this.configuracionService.crearAreaConocimiento(areaConocimientoDto);  
  }  


  @Get('citas-especialidades')  
  @ApiOperation({ summary: 'Listados de especialidades por área de conocimiento' })  
  @ApiQuery({  
    name: 'citacId',  
    type: Number,  
    required: true  
  })  
  async obtenerEspecialidades(@Query('citacId') citacId: number) {  
    return this.configuracionService.obtenerEspecialidades(citacId);  
  }  


  @Post('citas-especialidades')  
  @ApiOperation({ summary: 'Agrega especialidades a una categoría' })  
  @ApiBody({   
    type: CrearEspecialidadDto,  
    examples: {  
      default: {  
        value: {  
          citac_id: 1,  
          citcat_nombre: 'Dermatología',  
          citcat_descripcion: 'Especialidad médica enfocada en el diagnóstico y tratamiento de condiciones de la piel'  
        }  
      }  
    }  
  })  
  async crearEspecialidad(@Body() especialidadDto: CrearEspecialidadDto) {  
    return this.configuracionService.crearEspecialidad(especialidadDto);  
  } 


  @Get('medicos')  
  @ApiOperation({ summary: 'Visualización de médicos' })  
  async obtenerMedicos() {  
    return this.configuracionService.obtenerMedicos();  
  }    
  
}  