import {  
  Controller,  
  Get,  
  Post,  
  Put,  
  Body,
  Query,  
  UseGuards,  
  HttpException,  
  HttpStatus,  
  UploadedFile,  
  UseInterceptors,  
} from '@nestjs/common';  
import { ConsultoriaService } from '../services/consultoria.service';  
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';  
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';  
import { UploadedFiles } from '@nestjs/common';


import { CreateConsultoriaDto } from '../dtos/create-consultoria.dto';  
import { DeleteConsultoriaDto } from '../dtos/delete-consultoria.dto';  
import { UpdateConsultoriaDto } from '../dtos/update-consultoria.dto';  
import { CreateConsultoriaDependenciaDto } from '../dtos/create-consultoria-dependencia.dto';  
import { UpdateConsultoriaDependenciaDto } from '../dtos/update-consultoria-dependencia.dto';  
import { CreateConsultoriaRegistroDto } from '../dtos/create-consultoria-registro.dto';  
import { CreateConsultoriaRegistroDetalleDto } from '../dtos/create-consultoria-registro-detalle.dto';
import { UpdateConsultoriaDependenciaEliminarDto } from '../dtos/update-consultoria-dependencia-eliminar.dto';  

 

import {  
  ApiConsumes,  
  ApiBearerAuth,  
  ApiTags,  
  ApiBody,  
  ApiOperation,  
} from '@nestjs/swagger';  

@ApiTags('Consultoria')  
@ApiBearerAuth()  
@Controller('consultoria')  
@UseGuards(JwtAuthGuard)  
export class ConsultoriaController {  
  constructor(private readonly consultoriaService: ConsultoriaService) {}  

  @Post('consultoria-empresa')  
  @ApiBody({  
    schema: {  
      example: {  
        ccli_empresa: 'EMAPA',  
        ccli_ruc: '100200300001',  
        ccli_contacto_nombre: 'Juan Perez',  
        ccli_contacto_correo: 'jperez@emapa.gob.ec',  
        ccli_contacto_telefono: '0998578457',  
        ccli_provincia: 'Pichincha', // Nueva propiedad  
        ccli_ciudad: 'Quito',        // Nueva propiedad  
        ccli_direccion: 'Av. Amazonas 123', // Nueva propiedad  
        ctemp_id: '1',  
      },  
    },  
  }) 
  async createConsultoriaEmpresa(@Body() createConsultoriaDto: CreateConsultoriaDto) {  
    return this.consultoriaService.createConsultoriaEmpresa(createConsultoriaDto);  
  }  
 

  @Get('consultoria-empresa')  
  async getConsultoriaEmpresas() {  
    return this.consultoriaService.getConsultoriaEmpresas();  
  }  

  @Get('empresa-tipo')  
  @ApiOperation({ summary: 'Devuelve el tipo de empresa y su ID' })  
  async getEmpresaTipos() {  
    return this.consultoriaService.getEmpresaTipos();  
  }  

  @Put('eliminar-consultoria')  
  @ApiBody({  
    schema: {  
      example: {  
        ccli_id: 1,  
      },  
    },  
  })  
  async deleteConsultoria(@Body() deleteConsultoriaDto: DeleteConsultoriaDto) {  
    return this.consultoriaService.deleteConsultoria(deleteConsultoriaDto);  
  }  


  @Put('consultoria-empresa')  
  @ApiOperation({ summary: 'Edita los datos de un cliente registrado' })  
  @ApiBody({  
    type: UpdateConsultoriaDto,  
    description: 'Datos actualizados del cliente',  
    examples: {  
      example: {  
        summary: 'Ejemplo de datos para actualizar un cliente',  
        value: {  
          ccli_id: 1,  
          ctemp_id: 2,  
          ccli_empresa: 'EMAPA Actualizada',  
          ccli_ruc: '100200300001',  
          ccli_contacto_nombre: 'Juan Perez Actualizado',  
          ccli_contacto_correo: 'jperez_updated@emapa.gob.ec',  
          ccli_contacto_telefono: '0998578458',  
          ccli_provincia: 'Guayas',  // Nueva propiedad  
          ccli_ciudad: 'Guayaquil',  // Nueva propiedad  
          ccli_direccion: 'Av. 9 de Octubre 456', // Nueva propiedad  
        },  
      },  
    },  
  }) 
  async updateConsultoriaEmpresa(@Body() updateConsultoriaDto: UpdateConsultoriaDto) {  
    return this.consultoriaService.updateConsultoriaEmpresa(updateConsultoriaDto);  
  }

  

  @Post('consultoria-dependencias')  
  @ApiOperation({ summary: 'Crea una nueva dependencia' })  
  @ApiBody({ type: CreateConsultoriaDependenciaDto })  
  async createConsultoriaDependencia(@Body() createConsultoriaDependenciaDto: CreateConsultoriaDependenciaDto) {  
    return this.consultoriaService.createConsultoriaDependencia(createConsultoriaDependenciaDto);  
  }  

  @Get('consultoria-dependencias')  
  @ApiOperation({ summary: 'Muestra todas las dependencias' })  
  async getConsultoriaDependencias() {  
    return this.consultoriaService.getConsultoriaDependencias();  
  }  

  @Put('consultoria-dependencias')  
  @ApiOperation({ summary: 'Edita el nombre de una dependencia' })  
  @ApiBody({ type: UpdateConsultoriaDependenciaDto })  
  async updateConsultoriaDependencia(@Body() updateConsultoriaDependenciaDto: UpdateConsultoriaDependenciaDto) {  
    return this.consultoriaService.updateConsultoriaDependencia(updateConsultoriaDependenciaDto);  
  }  

  @Get('consultoria-registro-estado')  
  @ApiOperation({ summary: 'Devuelve los diferentes estados que puede tener una consultoría' })  
  async getConsultoriaRegistroEstado() {  
    return this.consultoriaService.getConsultoriaRegistroEstado();  
  }  

  @Get('consultoria-registro')  
  @ApiOperation({ summary: 'Listado de las consultorias registradas con sus respectivos estados' })  
  async getConsultoriaRegistro() {  
    return this.consultoriaService.getConsultoriaRegistro();  
  }  

  @Post('consultoria-registro')  
  @ApiOperation({  
    summary: 'Registro de una nueva consultoría',  
    description: 'Registra una nueva consultoría en el sistema.',  
  })  
  @ApiConsumes('multipart/form-data')  
  @ApiBody({  
    description: 'Datos para registrar una consultoría, incluyendo un archivo adjunto opcional',  
    schema: {  
      type: 'object',  
      properties: {  
        cdep_id: { type: 'integer', example: 1 },  
        ccli_id: { type: 'integer', example: 3 },  
        conr_fecha_registro: { type: 'string', format: 'date', example: '2025-01-07' },  
        conr_asunto: { type: 'string', example: 'Este es el asunto de la nueva consultoría.' },  
        file: { type: 'string', format: 'binary', nullable: true },  
      },  
    },  
  })  
  @UseInterceptors(FileInterceptor('file', {  
    fileFilter: (req, file, cb) => {  
      if (file) {  
        const allowedMimeTypes = [  
          'application/pdf',  
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',  
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',  
          'image/png',  
          'image/jpeg',  
        ];  
        if (!allowedMimeTypes.includes(file.mimetype)) {  
          return cb(new HttpException('Invalid file type', HttpStatus.BAD_REQUEST), false);  
        }  
      }  
      cb(null, true);  
    },  
    limits: { fileSize: 100 * 1024 * 1024 },
  }))  
  async createConsultoriaRegistro(  
    @Body() dto: CreateConsultoriaRegistroDto,  
    @UploadedFile() file?: Express.Multer.File,  
  ) {  
    return this.consultoriaService.createConsultoriaRegistro(dto, file);  
  }  


  @Get('consultoria-registro-tramite')  
  @ApiOperation({ summary: 'Devuelve los datos de una consultoria registrada por trámite' })  
  async getConsultoriaRegistroTramite(@Query('conr_tramite') conrTramite: string) {  
      return this.consultoriaService.getConsultoriaRegistroTramite(conrTramite);  
  }  


  @Put('consultoria-registro-tramite')  
  @ApiOperation({ summary: 'Actualiza información de un trámite por código de trámite' })  
  @ApiConsumes('multipart/form-data')  
  @ApiBody({  
    description: 'Datos para actualizar una consultoría, incluyendo un archivo adjunto opcional',  
    schema: {  
      type: 'object',  
      properties: {  
        conr_tramite: { type: 'string', example: 'AA0012' },  
        cdep_id: { type: 'integer', example: 1 },  
        ccli_id: { type: 'integer', example: 1 },  
        conr_fecha_registro: { type: 'string', format: 'date', example: '2025-01-07' },  
        conr_fecha_despacho: { type: 'string', format: 'date', example: '2025-01-08' },  
        conr_asunto: { type: 'string', example: 'Nuevo asunto de consultoría' },  
        file: { type: 'string', format: 'binary', nullable: true },  
        conre_id: { type: 'integer', example: 1 },  
        conr_observacion: { type: 'string', example: 'Ninguna' }  
      },  
    },  
  })  
  @UseInterceptors(FileInterceptor('file', {  
    fileFilter: (req, file, cb) => {  
      if (file) {  
        const allowedMimeTypes = [  
          'application/pdf',  
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',  
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',  
          'image/png',  
          'image/jpeg',  
        ];  
        if (!allowedMimeTypes.includes(file.mimetype)) {  
          return cb(new HttpException('Invalid file type', HttpStatus.BAD_REQUEST), false);  
        }  
      }  
      cb(null, true);  
    }, 
    limits: { fileSize: 100 * 1024 * 1024 }, 
  }))  
  async updateConsultoriaRegistroTramite(  
    @Query('conr_tramite') conrTramite: string,  
    @Body() dto: any,  
    @UploadedFile() file?: Express.Multer.File  
  ) {  
    return this.consultoriaService.updateConsultoriaRegistroTramite(conrTramite, dto, file);  
  }  

  @Get('consultoria-registro-tramite-obs')
  @ApiOperation({ summary: 'Muestra la observación de un trámite' })
  async getConsultoriaRegistroTramiteObs(@Query('conr_tramite') conrTramite: string) {
      return this.consultoriaService.getConsultoriaRegistroTramiteObs(conrTramite);
  }




  @Post('consultoria-registro-tramite-detalle')  
  @ApiOperation({ summary: 'Registro del detalle o avance de una consultoría' })  
  @ApiConsumes('multipart/form-data')  
  @ApiBody({  
    schema: {  
      type: 'object',  
      properties: {  
        conr_tramite: { type: 'string', example: 'AA0014' },  
        conr_fecha_despacho: { type: 'string', format: 'date', example: '2025-01-29' },  
        conre_id: { type: 'integer', example: 2 },  
        conr_observacion: { type: 'string', example: 'Observación del avance o acción' },  
        file: { type: 'string', format: 'binary', nullable: true },  
      },  
    },  
  })  
  @UseInterceptors(FileInterceptor('file', {  
    fileFilter: (req, file, cb) => {  
      const allowedMimeTypes = [  
        'application/pdf',  
        'application/msword',  
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',  
        'application/vnd.ms-excel',  
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',  
        'image/png',  
        'image/jpeg',  
      ];  
      if (!allowedMimeTypes.includes(file.mimetype)) {  
        return cb(new HttpException('Invalid file type', HttpStatus.BAD_REQUEST), false);  
      }  
      cb(null, true);  
    },  
    limits: { fileSize: 100 * 1024 * 1024 },
  }))  
  async createConsultoriaRegistroDetalle(  
    @Body() dto: CreateConsultoriaRegistroDetalleDto,  
    @UploadedFile() file?: Express.Multer.File,  
  ) {  
    return this.consultoriaService.createConsultoriaRegistroDetalle(dto, file);  
  }  
  


  @Get('consultoria-registro-tramite-detalle')
  @ApiOperation({ summary: 'Obtiene el detalle de una consultoría por ID de trámite' })
  async getConsultoriaRegistroDetalle(@Query('conr_tramite') conrTramite: string) {
        return this.consultoriaService.getConsultoriaRegistroDetalle(conrTramite);
  }

  @Get('consultoria-faq')
  @ApiOperation({ summary: 'Obtener todas las preguntas frecuentes activas' })
  async getConsultoriaFaq() {
    return await this.consultoriaService.findAllFaq();
  }


  @Put('consultoria-dependencia-eliminar')  
  @ApiOperation({ summary: 'Elimina una dependencia por id de dependencia' })  
  @ApiBody({  
    type: UpdateConsultoriaDependenciaEliminarDto,  
    description: 'ID de la dependencia a eliminar',  
    examples: {  
      example: {  
        summary: 'Ejemplo de eliminación lógica de dependencia',  
        value: {  
          cdep_id: 1  
        },  
      },  
    },  
  })  
  async eliminarDependencia(  
    @Body() updateConsultoriaDependenciaEliminarDto: UpdateConsultoriaDependenciaEliminarDto  
  ) {  
    return this.consultoriaService.eliminarDependencia(updateConsultoriaDependenciaEliminarDto);  
  }  



}