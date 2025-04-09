import { Injectable, HttpException, HttpStatus, NotFoundException, InternalServerErrorException } from '@nestjs/common';  
import { InjectRepository } from '@nestjs/typeorm';  
import { Repository, DataSource } from 'typeorm';  
import { ConsultoriaCliente } from '../entities/consultoria-cliente.entity';  
import { CreateConsultoriaDto } from '../dtos/create-consultoria.dto';  
import { DeleteConsultoriaDto } from '../dtos/delete-consultoria.dto';  
import { UpdateConsultoriaDto } from '../dtos/update-consultoria.dto';  
import { ConsultoriaDependencia } from '../entities/consultoria-dependencia.entity';  
import { ConsultoriaRegistroEstado } from '../entities/tbl-consultoria-registro-estado.entity';  
import { ConsultoriaRegistro } from '../entities/tbl-consultoria-registro.entity';  
import { GlobalDominios } from '../entities/global_dominios.entity';  
import { CreateConsultoriaRegistroDto } from '../dtos/create-consultoria-registro.dto';  
import { CreateConsultoriaDependenciaDto } from '../dtos/create-consultoria-dependencia.dto';  
import { UpdateConsultoriaDependenciaDto } from '../dtos/update-consultoria-dependencia.dto';  

import { ConsultoriaRegistroDetalle } from '../entities/tbl-consultoria-registro-detalle.entity';
import { CreateConsultoriaRegistroDetalleDto } from '../dtos/create-consultoria-registro-detalle.dto';

import { UpdateConsultoriaDependenciaEliminarDto } from '../dtos/update-consultoria-dependencia-eliminar.dto';

import * as FormData from 'form-data';  
import axios from 'axios';  
import * as https from 'https'; 


@Injectable()  
export class ConsultoriaService {  
  private readonly remoteServerUrl = process.env.REMOTE_SERVER_URL;  

  constructor(  
    @InjectRepository(GlobalDominios)  
    private readonly globalDominiosRepository: Repository<GlobalDominios>,  
    @InjectRepository(ConsultoriaCliente)  
    private readonly consultoriaClienteRepository: Repository<ConsultoriaCliente>,  
    @InjectRepository(ConsultoriaDependencia)  
    private readonly consultoriaDependenciaRepository: Repository<ConsultoriaDependencia>,  
    @InjectRepository(ConsultoriaRegistroEstado)  
    private readonly consultoriaRegistroEstadoRepository: Repository<ConsultoriaRegistroEstado>,  
    @InjectRepository(ConsultoriaRegistro)  
    private readonly consultoriaRegistroRepository: Repository<ConsultoriaRegistro>,  
    @InjectRepository(ConsultoriaRegistroDetalle)
    private readonly consultoriaRegistroDetalleRepository: Repository<ConsultoriaRegistroDetalle>,
    private readonly dataSource: DataSource,  
  ) {} 



  // Métodos del servicio...  
  async createConsultoriaEmpresa(createConsultoriaDto: CreateConsultoriaDto) {  
    const newConsultoria = this.consultoriaClienteRepository.create({  
      ...createConsultoriaDto,  
      ctemp_id: Number(createConsultoriaDto.ctemp_id),  
      ccli_estado: 1,  
      ccli_fecha_registro: new Date(),  
    });  
    return this.consultoriaClienteRepository.save(newConsultoria);  
  }  

  async getConsultoriaEmpresas() {  
    const query = `  
        SELECT  ccli_empresa as "Empresa",   
                ccli_ruc as "Ruc",  
                ccli_contacto_nombre as "Contacto",   
                ccli_contacto_correo as "Correo",  
                ccli_contacto_telefono as "Teléfono",  
                ccli_provincia as "Provincia", -- Nueva columna  
                ccli_ciudad as "Ciudad",       -- Nueva columna  
                ccli_direccion as "Dirección", -- Nueva columna  
                ctemp_id as "Tipo de empresa",  
                ccli_id as "Acción"  
        FROM public.tbl_consultoria_clientes  
        WHERE ccli_estado = 1;  
    `;  
    return this.consultoriaClienteRepository.query(query);  
  }  



  async createConsultoriaDependencia(createConsultoriaDependenciaDto: CreateConsultoriaDependenciaDto) {  
    const query = `  
      INSERT INTO public.tbl_consultoria_dependencias (cdep_dependencia)  
      VALUES ($1)  
      RETURNING cdep_id;  
    `;  
    const result = await this.consultoriaDependenciaRepository.query(query, [  
      createConsultoriaDependenciaDto.cdep_dependencia,  
    ]);  

    if (result.length === 0) {  
      throw new HttpException('Error al crear la dependencia', HttpStatus.INTERNAL_SERVER_ERROR);  
    }  

    return { message: 'Dependencia creada correctamente', cdep_id: result[0].cdep_id };  
  }  

  async getConsultoriaDependencias() {  
    const query = `  
      SELECT cdep_id, cdep_dependencia  
      FROM public.tbl_consultoria_dependencias  
      WHERE cdep_estado = 1  
      ORDER BY cdep_dependencia;  
    `;  
    return this.consultoriaDependenciaRepository.query(query);  
  }  

  async updateConsultoriaDependencia(updateConsultoriaDependenciaDto: UpdateConsultoriaDependenciaDto) {  
    const query = `  
      UPDATE public.tbl_consultoria_dependencias  
      SET cdep_dependencia = $1  
      WHERE cdep_id = $2  
      RETURNING cdep_id;  
    `;  
    const result = await this.consultoriaDependenciaRepository.query(query, [  
      updateConsultoriaDependenciaDto.cdep_dependencia,  
      updateConsultoriaDependenciaDto.cdep_id,  
    ]);  

    if (result.length === 0) {  
      throw new HttpException('Dependencia no encontrada o actualización fallida', HttpStatus.NOT_FOUND);  
    }  

    return { message: 'Dependencia actualizada correctamente', cdep_id: result[0].cdep_id };  
  }  

  async getConsultoriaRegistroEstado() {  
    const query = `  
      SELECT conre_id, conre_nombre  
      FROM public.tbl_consultoria_registro_estado  
      WHERE conre_estado = 1  
      ORDER BY conre_nombre;  
    `;  
    return this.consultoriaRegistroEstadoRepository.query(query);  
  }  

  async getConsultoriaRegistro() {  
      const registros = await this.dataSource.query(`  
        SELECT  
            cr.conr_tramite  AS "Trámite",
            cd.cdep_dependencia AS "Dependencia",  
            cc.ccli_empresa AS "Empresa cliente",  
            cr.conr_fecha_registro AS "Fecha de registro",  
            cr.conr_fecha_despacho AS "Fecha de despacho",  
            cr.conr_asunto AS "Asunto",  
            cr.conr_adjunto,  
            cre.conre_nombre AS "Estado",  
            cr.conr_observacion AS "Observación",
            cr.conr_id
        FROM public.tbl_consultoria_registro cr  
        JOIN public.tbl_consultoria_dependencias cd ON cd.cdep_id = cr.cdep_id  
        JOIN public.tbl_consultoria_clientes cc ON cc.ccli_id = cr.ccli_id  
        JOIN public.tbl_consultoria_registro_estado cre ON cre.conre_id = cr.conre_id   
        ORDER BY cr.conr_fecha_registro DESC;  
      `);  
        
      const dominio = await this.globalDominiosRepository.findOne({ where: { dom_id: 1 } });

      return {
        registros,
        dominio: dominio?.dom_nombre
      };
  }

  async getEmpresaTipos() {  
    const query = `  
      SELECT cempt_id, cempt_nombre  
      FROM public.tbl_consultoria_empresa_tipo  
      WHERE cempt_estado = 1;  
    `;  
    return this.consultoriaClienteRepository.query(query);  
  }  

  async deleteConsultoria(deleteConsultoriaDto: DeleteConsultoriaDto) {  
    const { ccli_id } = deleteConsultoriaDto;  
    return this.consultoriaClienteRepository.update(  
      { ccli_id },  
      {  
        ccli_estado: 0,  
        ccli_fecha_eliminacion: new Date(),  
      },  
    );  
  }  

  async updateConsultoriaEmpresa(updateConsultoriaDto: UpdateConsultoriaDto) {  
    const { ccli_id, ctemp_id, ccli_empresa, ccli_ruc, ccli_contacto_nombre, ccli_contacto_correo, ccli_contacto_telefono } = updateConsultoriaDto;  

    const query = `  
      UPDATE public.tbl_consultoria_clientes  
      SET   
        ctemp_id = $1,   
        ccli_empresa = $2,   
        ccli_ruc = $3,   
        ccli_contacto_nombre = $4,   
        ccli_contacto_correo = $5,   
        ccli_contacto_telefono = $6  
      WHERE   
        ccli_id = $7  
      RETURNING ccli_id;  
    `;  
    const result = await this.consultoriaClienteRepository.query(query, [  
      ctemp_id, ccli_empresa, ccli_ruc, ccli_contacto_nombre, ccli_contacto_correo, ccli_contacto_telefono, ccli_id,  
    ]);  

    if (result.length === 0) {  
      throw new HttpException('Cliente no encontrado o actualización fallida', HttpStatus.NOT_FOUND);  
    }  

    return { message: 'Cliente actualizado correctamente', ccli_id: result[0].ccli_id };  
  }  



  // Método para subir un archivo al servidor remoto  
  private async uploadFileToRemoteServer(  
    file: Express.Multer.File,  
    remoteUploadUrl: string,  
    fileName: string,  
  ): Promise<void> {  
    console.log(`Subiendo archivo con nombre: ${fileName}`);  
    console.log(`Tipo MIME del archivo: ${file.mimetype}`);  
    console.log(`Tamaño del archivo: ${file.size} bytes`);  
    console.log(`URL remota: ${remoteUploadUrl}`);  

    const formData = new FormData();  
    formData.append('file', file.buffer, { filename: fileName, contentType: file.mimetype });  

    try {  
      // Definimos al agente HTTPS  
      const httpsAgent = new https.Agent({  
        rejectUnauthorized: false, // Permitir certificados SSL autofirmados  
      });  

      // Configuración para Axios (alineada con versiones recientes)  
      const response = await axios.post(remoteUploadUrl, formData, {  
        headers: {  
          ...formData.getHeaders(),  
        },  
        httpsAgent, // Especificamos el agente HTTPS  
      });  

      console.log(`Archivo subido exitosamente a ${remoteUploadUrl}:`, response.data);  
    } catch (error) {  
      console.error(`Error al subir archivo: ${error.message}`);  
      console.error(`Detalles del error:`, error.stack);  

      throw new Error(`File upload failed: ${error.message}`);  
    }  
  }  





  // Método para registrar una nueva consultoría con archivo adjunto  
  
    // Método para registrar una nueva consultoría con archivo adjunto  
    async createConsultoriaRegistro(  
        dto: CreateConsultoriaRegistroDto,  
        file?: Express.Multer.File,  
    ) {  
        const { cdep_id, ccli_id, conr_fecha_registro, conr_asunto } = dto;  
    
        try {  
        console.log('Valores recibidos para la creación: ', dto); // Log de los datos de entrada  
    
        // Validar que cdep_id y ccli_id sean números  
        if (isNaN(Number(cdep_id)) || isNaN(Number(ccli_id))) {  
            throw new HttpException(  
            `cdep_id (${cdep_id}) y ccli_id (${ccli_id}) deben ser valores numéricos.`,  
            HttpStatus.BAD_REQUEST,  
            );  
        }  
    
        // Generar el código del trámite  
        const lastTramite = await this.dataSource.query(`  
            SELECT conr_tramite  
            FROM public.tbl_consultoria_registro  
            ORDER BY conr_id DESC  
            LIMIT 1;  
        `);  
        const newTramite = this.generateTramiteCode(lastTramite[0]?.conr_tramite || 'AA0000');  
    
        let filePath: string | null = null;  
    
        if (file) {  
            const newFileName = this.generateFileName(file.originalname);  

            // Obtener la URL base del servidor remoto  
            let baseRemoteServerUrl = await this.getRemoteServerUrl();  
 
            // Eliminar cualquier espacio extra o barra redundante al final  
            baseRemoteServerUrl = baseRemoteServerUrl.replace(/\s+$/, '').replace(/\/+$/, ''); 
     
            // Agregar la ruta específica solo para este método  
            const remoteUploadUrl = `${baseRemoteServerUrl}/index.php/consultoria-registro`;  
    
            console.log(`URL remota construida: ${remoteUploadUrl}`); // Log para validar la URL generada  
    
            // Subir el archivo al servidor remoto  
            await this.uploadFileToRemoteServer(file, remoteUploadUrl, newFileName);  
    
            // Registrar la ruta del archivo  
            filePath = `/public/consultoria/registro/${newFileName}`;  
            console.log(`Archivo guardado correctamente. Ruta: ${filePath}`);  
        }  
    
        // Insertar el nuevo registro en la base de datos  
        const query = `  
            INSERT INTO public.tbl_consultoria_registro (  
            conr_tramite, cdep_id, ccli_id, conr_fecha_registro, conr_asunto, conr_adjunto, conre_id  
            ) VALUES ($1, $2, $3, $4, $5, $6, 1)  
            RETURNING conr_id;  
        `;  
        const result = await this.dataSource.query(query, [  
            newTramite,  
            Number(cdep_id),  
            Number(ccli_id),  
            conr_fecha_registro,  
            conr_asunto || null,  
            filePath,  
        ]);  
    
        // Retornar la respuesta exitosa  
        return {  
            message: 'Consultoría registrada correctamente',  
            conr_id: result[0].conr_id,  
            conr_tramite: newTramite,  
            conr_adjunto: filePath,  
        };  
        } catch (error) {  
        console.error(`Error en createConsultoriaRegistro: ${error.message}`);  
        console.error(`Detalles del error:`, error.stack);  
    
        throw new HttpException(  
            `Error al registrar la consultoría: ${error.message}`,  
            HttpStatus.INTERNAL_SERVER_ERROR,  
        );  
        }  
    }
 

  // Generar un nombre único para el archivo  
  private generateFileName(originalName: string): string {  
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '');  
    const randomString = Math.random().toString(36).substring(7);  
    const ext = originalName.split('.').pop();  
    return `${timestamp}-${randomString}.${ext}`;  
  }  

  // Generar código de trámite  
  private generateTramiteCode(lastTramite: string): string {  
    const letters = lastTramite.substring(0, 2);  
    const number = parseInt(lastTramite.substring(2)) + 1;  

    if (number > 9999) {  
      const nextLetter1 = letters.charCodeAt(0) < 90 ? letters.charCodeAt(0) + 1 : 65;  
      const nextLetter2 = letters.charCodeAt(1) < 90 ? letters.charCodeAt(1) + 1 : 65;  
      return `${String.fromCharCode(nextLetter1)}${String.fromCharCode(nextLetter2)}0001`;  
    }  

    return `${letters}${number.toString().padStart(4, '0')}`;  
  }  


  private async getRemoteServerUrl(): Promise<string> {  
    const query = `  
      SELECT dom_nombre  
      FROM public.tbl_global_dominios  
       
    `;  

    const result = await this.globalDominiosRepository.query(query);  

    if (result.length === 0) {  
      throw new HttpException(  
        'No se encontró la URL del servidor remoto en la tabla tbl_global_dominios.',  
        HttpStatus.INTERNAL_SERVER_ERROR,  
      );  
    }  

    const remoteUrl = result[0].dom_nombre;  
    console.log(`URL remota encontrada: ${remoteUrl}`); // Registrar la URL obtenida  
    return remoteUrl;  
  }


  async getConsultoriaRegistroTramite(conrTramite: string) {  
      const registros = await this.dataSource.query(`  
        SELECT   
          cr.conr_id,   
          cr.conr_tramite AS "N° Trámite",   
          cd.cdep_id,   
          cd.cdep_dependencia AS "Dependencia",   
          cc.ccli_id,   
          cc.ccli_empresa AS "Empresa",   
          cr.conr_fecha_registro AS "Fecha registro",   
          cr.conr_fecha_despacho AS "Fecha despacho",   
          cr.conr_asunto AS "Asunto",   
          cr.conr_adjunto AS "Adjunto",   
          cre.conre_id,   
          cre.conre_nombre AS "Estado",   
          cr.conr_observacion AS "Observación"   
        FROM public.tbl_consultoria_registro cr   
        JOIN public.tbl_consultoria_dependencias cd ON cd.cdep_id = cr.cdep_id   
        JOIN public.tbl_consultoria_clientes cc ON cc.ccli_id = cr.ccli_id   
        JOIN public.tbl_consultoria_registro_estado cre ON cre.conre_id = cr.conre_id   
        WHERE cr.conr_tramite = $1   
        ORDER BY cr.conr_fecha_registro DESC;  
      `, [conrTramite]);  
      
      return registros;  
  }


  async updateConsultoriaRegistroTramite(conrTramite: string, dto: any, file?: Express.Multer.File) {
    let filePath: string | null = null;

    if (file) {
      const newFileName = this.generateFileName(file.originalname);
      let baseRemoteServerUrl = await this.getRemoteServerUrl();
      baseRemoteServerUrl = baseRemoteServerUrl.replace(/\s+$/, '').replace(/\/+$/, '');
      const remoteUploadUrl = `${baseRemoteServerUrl}/index.php/consultoria-registro`;
      await this.uploadFileToRemoteServer(file, remoteUploadUrl, newFileName);
      filePath = `/public/consultoria/registro/${newFileName}`;
    }

    // Filtrar valores undefined y asegurar que no se incluya "file"
    const updateFields = Object.fromEntries(
      Object.entries({ ...dto, conr_adjunto: filePath || dto.conr_adjunto })
        .filter(([key, value]) => value !== undefined && key !== 'file')
    );

    console.log('Campos a actualizar después de limpiar:', updateFields);

    const fieldsToUpdate = Object.entries(updateFields)
      .map(([key, value], index) => `${key} = $${index + 1}`)
      .join(', ');

    if (!fieldsToUpdate) {
      throw new HttpException('No valid fields to update', HttpStatus.BAD_REQUEST);
    }

    const query = `
      UPDATE public.tbl_consultoria_registro
      SET ${fieldsToUpdate}
      WHERE conr_tramite = $${Object.keys(updateFields).length + 1}
      RETURNING conr_id;
    `;

    const values = [...Object.values(updateFields), conrTramite];

    console.log('Consulta generada:', query);
    console.log('Valores:', values);

    const result = await this.dataSource.query(query, values);

    if (result.length === 0) {
      throw new HttpException('Trámite no encontrado o actualización fallida', HttpStatus.NOT_FOUND);
    }

    return { message: 'Trámite actualizado correctamente', conr_id: result[0].conr_id };
  }


  async getConsultoriaRegistroTramiteObs(conrTramite: string) {
    const query = `
      SELECT conr_observacion AS "Observación"
      FROM public.tbl_consultoria_registro
      WHERE conr_tramite = $1;
    `;

    const result = await this.dataSource.query(query, [conrTramite]);

    if (result.length === 0) {
      throw new HttpException('Trámite no encontrado', HttpStatus.NOT_FOUND);
    }

    return result[0];
  }

    async createConsultoriaRegistroDetalle(dto: CreateConsultoriaRegistroDetalleDto, file?: Express.Multer.File) {  
    const { conr_tramite, conr_fecha_despacho, conre_id, conr_observacion } = dto;  
    let filePath: string | null = null;  

    if (file) {  
        const newFileName = this.generateFileName(file.originalname);  
        let baseRemoteServerUrl = await this.getRemoteServerUrl();  
        baseRemoteServerUrl = baseRemoteServerUrl.replace(/\s+$/, '').replace(/\/+$/, '');  
        const remoteUploadUrl = `${baseRemoteServerUrl}/index.php/consultoria-registro`;  

        try {  
        // Subir el archivo al servidor remoto  
        await this.uploadFileToRemoteServer(file, remoteUploadUrl, newFileName);  
        filePath = `/public/consultoria/registro/${newFileName}`;  
        console.log(`Archivo guardado correctamente. Ruta: ${filePath}`);  
        } catch (error) {  
        console.error(`Error al subir el archivo: ${error.message}`);  
        throw new HttpException('Error al subir el archivo', HttpStatus.INTERNAL_SERVER_ERROR);  
        }  
    }  

    const query = `  
        INSERT INTO public.tbl_consultoria_registro_detalle (conr_tramite, conr_fecha_despacho, conre_id, conr_observacion, conrd_adjunto)  
        VALUES ($1, $2, $3, $4, $5)  
        RETURNING conrd_id;`;  
        
    const result = await this.dataSource.query(query, [  
        conr_tramite,  
        conr_fecha_despacho,  
        conre_id,  
        conr_observacion,  
        filePath, // Almacenar la ruta del archivo  
    ]);  

    return { message: 'Detalle registrado correctamente', conrd_id: result[0].conrd_id };  
    }




    async getConsultoriaRegistroDetalle(conrTramite: string) {  
        const registros = await this.dataSource.query(`  
            SELECT   
                crd.conrd_id,   
                crd.conr_tramite,   
                crd.conr_fecha_despacho,   
                cre.conre_nombre,   
                crd.conr_observacion,   
                crd.conrd_adjunto  
            FROM   
                public.tbl_consultoria_registro_detalle crd  
            JOIN   
                public.tbl_consultoria_registro_estado cre   
            ON   
                cre.conre_id = crd.conre_id  
            WHERE   
                crd.conr_tramite = $1;  
        `, [conrTramite]);  

        const dominio = await this.globalDominiosRepository.findOne({ where: { dom_id: 1 } });  

        return {  
            registros,  
            dominio: dominio?.dom_nombre?.trim() // Aplicando .trim() para eliminar espacios al inicio y al final  
        };  
    }



    async findAllFaq() {

      const registros = await this.dataSource.query(`  
        SELECT conf_titulo, conf_detalle, conf_video
        FROM public.tbl_consultoria_faq
        WHERE conf_estado = 1;
      `);  
        
      const dominio = await this.globalDominiosRepository.findOne({ where: { dom_id: 1 } });

      return {
        registros,
        dominio: dominio?.dom_nombre?.trim() 
      };
    }


  async eliminarDependencia(updateConsultoriaDependenciaEliminarDto: UpdateConsultoriaDependenciaEliminarDto) {  
    try {  
      const { cdep_id } = updateConsultoriaDependenciaEliminarDto;  
      
      const result = await this.consultoriaDependenciaRepository  
        .createQueryBuilder()  
        .update(ConsultoriaDependencia)  
        .set({ cdep_estado: 0 })  
        .where('cdep_id = :cdep_id', { cdep_id })  
        .execute();  

      if (result.affected === 0) {  
        throw new NotFoundException(`Dependencia con ID ${cdep_id} no encontrada`);  
      }  

      return {  
        message: 'Dependencia eliminada exitosamente',  
        cdep_id  
      };  
    } catch (error) {  
      if (error instanceof NotFoundException) {  
        throw error;  
      }  
      throw new InternalServerErrorException('Error al eliminar la dependencia');  
    }  
  }  


}