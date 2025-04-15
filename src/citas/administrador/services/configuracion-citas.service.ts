import { Injectable, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';  
import { InjectRepository } from '@nestjs/typeorm';  
import { Repository } from 'typeorm';  
import { ConfiguracionCitas } from '../entities/configuracion-citas.entity';  
import { CrearDiaNoLaboralDto } from '../dtos/crear-dia-no-laboral.dto';  
import { ActualizarDiaNoLaboralDto } from '../dtos/actualizar-dia-no-laboral.dto';  
import { ActualizarConfiguracionCitasDto } from '../dtos/actualizar-configuracion-citas.dto'; 
import { CrearEspecialidadDto } from '../dtos/crear-especialidad.dto'; 
import { CrearAreaConocimientoDto } from '../dtos/crear-area-conocimiento.dto'; 
import { CreateMedicoDto } from '../dtos/create-medico.dto';
import { CreateHorarioMedicoDto } from '../dtos/create-horario-medico.dto'; 

@Injectable()  
export class ConfiguracionCitasService {  
  constructor(  
    @InjectRepository(ConfiguracionCitas)  
    private configuracionRepository: Repository<ConfiguracionCitas>  
  ) {}  

  async obtenerConfiguracionHorario(): Promise<any[]> {  
    return this.configuracionRepository.query(`  
      SELECT   
        citc_id AS "citcId",   
        citc_tiempo_maximo_cita AS "tiempoMaximoCita",   
        citc_intervalo_cita AS "intervaloCita",  
        citc_hora_inicio AS "horaInicio",   
        citc_hora_fin AS "horaFin"  
      FROM public.tbl_citas_configuracion  
    `);  
  }  



  
 

  async actualizarConfiguracionHorario(  
    citcId: number,   
    datosActualizacion: ActualizarConfiguracionCitasDto  
  ): Promise<any> {  
    const setClauses = [];  
    const values = [];  
    let index = 1;  

    if (datosActualizacion.citc_tiempo_maximo_cita !== undefined) {  
      setClauses.push(`citc_tiempo_maximo_cita = $${index}`);  
      values.push(datosActualizacion.citc_tiempo_maximo_cita);  
      index++;  
    }  

    if (datosActualizacion.citc_intervalo_cita !== undefined) {  
      setClauses.push(`citc_intervalo_cita = $${index}`);  
      values.push(datosActualizacion.citc_intervalo_cita);  
      index++;  
    }  

    if (datosActualizacion.citc_hora_inicio !== undefined) {  
      setClauses.push(`citc_hora_inicio = $${index}`);  
      values.push(datosActualizacion.citc_hora_inicio);  
      index++;  
    }  

    if (datosActualizacion.citc_hora_fin !== undefined) {  
      setClauses.push(`citc_hora_fin = $${index}`);  
      values.push(datosActualizacion.citc_hora_fin);  
      index++;  
    }  

    // Verificar si hay campos para actualizar  
    if (setClauses.length === 0) {  
      throw new BadRequestException('No hay campos para actualizar');  
    }  

    values.push(citcId);  

    const query = `  
      UPDATE public.tbl_citas_configuracion   
      SET ${setClauses.join(', ')}  
      WHERE citc_id = $${index}  
      RETURNING *  
    `;  

    const resultado = await this.configuracionRepository.query(query, values);  
    return resultado[0];  
  }  


  
  async actualizarDiaNoLaboral  (citdnlId: number): Promise<any> {  
    const query = `  
      UPDATE public.tbl_citas_dias_no_laborales   
      SET citdnl_estado = NOT citdnl_estado  
      WHERE citdnl_id = $1  
      RETURNING *  
    `;  

    const resultado = await this.configuracionRepository.query(query, [citdnlId]);  
    return resultado[0];  
  }  

  async cambiarEstadoDiaNoLaboral(citdnlId: number): Promise<any> {  
    const query = `  
      UPDATE public.tbl_citas_dias_no_laborales   
      SET citdnl_estado = NOT citdnl_estado  
      WHERE citdnl_id = $1  
      RETURNING *  
    `;  

    const resultado = await this.configuracionRepository.query(query, [citdnlId]);  
    return resultado[0];  
  }  

  async editarDiaNoLaboral(citdnlId: number, dto: ActualizarDiaNoLaboralDto): Promise<any> {  
    const setClauses = [];  
    const values = [];  
    let index = 1;  

    if (dto.fecha !== undefined) {  
      setClauses.push(`citdnl_fecha = $${index}`);  
      values.push(dto.fecha);  
      index++;  
    }  

    if (dto.descripcion !== undefined) {  
      setClauses.push(`citdnl_descripcion = $${index}`);  
      values.push(dto.descripcion);  
      index++;  
    }  

    values.push(citdnlId);  

    const query = `  
      UPDATE public.tbl_citas_dias_no_laborales   
      SET ${setClauses.join(', ')}  
      WHERE citdnl_id = $${index}  
      RETURNING *  
    `;  

    const resultado = await this.configuracionRepository.query(query, values);  
    return resultado[0];  
  }   

  async obtenerAreasConocimiento(): Promise<any[]> {  
    const query = `  
      SELECT   
        citac_id AS "citacId",   
        citac_nombre AS "nombre",   
        citac_descripcion AS "descripcion"  
      FROM public.tbl_citas_areas_conocimiento  
    `;  

    return this.configuracionRepository.query(query);  
  }  

  async obtenerConfiguracionDias(): Promise<any[]> {  
    const query = `  
      SELECT   
        citds_id AS "citdsId",   
        citds_nombre AS "nombre",   
        citds_codigo AS "codigo"  
      FROM public.tbl_citas_dias_semana  
      WHERE citds_estado = 1
    `;  
    return this.configuracionRepository.query(query);  
  }  

  async obtenerDiasNoLaborables(): Promise<any[]> {  
    const query = `  
      SELECT   
        citdnl_id AS "citdnlId",  
        citdnl_fecha AS "fecha",  
        citdnl_descripcion AS "descripcion",  
        citdnl_estado AS "estado"  
      FROM public.tbl_citas_dias_no_laborales 
    `;  
    return this.configuracionRepository.query(query);  
  }  


    async crearDiaNoLaboral(dto: CrearDiaNoLaboralDto): Promise<any> {  
        console.log('DTO recibido:', dto);  

        const query = `  
        INSERT INTO public.tbl_citas_dias_no_laborales   
        (citdnl_fecha, citdnl_descripcion, citdnl_usuario_creacion, citdnl_estado)   
        VALUES ($1, $2, $3, $4)  
        RETURNING *  
        `;  
        
        const valores = [  
            dto.citdnl_fecha,   
            dto.citdnl_descripcion,   
            dto.citdnl_usuario_creacion,  
            true   
        ];  

        console.log('Valores a insertar:', valores);  

        try {  
            const resultado = await this.configuracionRepository.query(query, valores);  
            console.log('Resultado de inserción:', resultado);  
            return resultado[0];  
        } catch (error) {  
            console.error('Error completo al crear día no laborable:', error);  
            throw new BadRequestException(error.message || 'Error al crear día no laborable');  
        }  
    }    


  async crearAreaConocimiento(areaConocimientoDto: CrearAreaConocimientoDto): Promise<any> {  
    const query = `  
      INSERT INTO public.tbl_citas_areas_conocimiento   
      (citac_nombre, citac_descripcion)   
      VALUES ($1, $2)  
      RETURNING citac_id  
    `;  

    const values = [  
      areaConocimientoDto.citac_nombre,  
      areaConocimientoDto.citac_descripcion  
    ];  

    return this.configuracionRepository.query(query, values);  
  }   
   

  async obtenerEspecialidades(citacId: number): Promise<any[]> {  
    const query = `  
      SELECT   
        citcat_id,   
        citcat_nombre AS "ESPECIALIDAD",   
        citcat_descripcion AS "DESCRIPCIÓN"  
      FROM public.tbl_citas_categorias  
      WHERE citcat_estado = 1 AND citac_id = $1  
    `;  
    return this.configuracionRepository.query(query, [citacId]);  
  }  


  async crearEspecialidad(especialidadDto: CrearEspecialidadDto): Promise<any> {  
    const query = `  
      INSERT INTO public.tbl_citas_categorias   
      (citac_id, citcat_nombre, citcat_descripcion, citcat_estado)   
      VALUES ($1, $2, $3, 1)  
      RETURNING citcat_id  
    `;  

    const values = [  
      especialidadDto.citac_id,  
      especialidadDto.citcat_nombre,  
      especialidadDto.citcat_descripcion  
    ];  

    return this.configuracionRepository.query(query, values);  
  } 


  async obtenerMedicos(): Promise<any[]> {  
    const query = `  
      SELECT   
        cm.citm_id AS "citm_id",  
        u.usu_nombre AS "Nombre",  
        u.usu_apellido AS "Apellido",   
        ac.citac_nombre AS "Área del conocimiento",  
        cm.citm_descripcion AS "Descripción",  
        cm.citm_estado AS "citm_estado"  
      FROM   
        public.tbl_citas_medicos cm  
      JOIN   
        public.tbl_usuarios u ON cm.usu_id = u.usu_id  
      JOIN   
        public.tbl_citas_areas_conocimiento ac ON cm.citac_id = ac.citac_id  
    `;  
    return this.configuracionRepository.query(query);  
  }       



  async registrarMedico(createMedicoDto: CreateMedicoDto): Promise<any> {  
    const { usu_id, citac_id, citm_descripcion } = createMedicoDto;  

    try {  
      // Verificar si el usuario ya está registrado como médico  
      const existeMedico = await this.configuracionRepository.query(`  
        SELECT citm_id   
        FROM public.tbl_citas_medicos   
        WHERE usu_id = $1  
      `, [usu_id]);  

      // Si ya existe, lanzar una excepción  
      if (existeMedico.length > 0) {  
        throw new HttpException(  
          'El usuario ya está registrado como médico',   
          HttpStatus.BAD_REQUEST  
        );  
      }  

      // Iniciar transacción  
      const queryRunner = this.configuracionRepository.manager.connection.createQueryRunner();  
      await queryRunner.connect();  
      await queryRunner.startTransaction();  

      try {  
        // Insertar en tbl_citas_medicos  
        const medicoQuery = `  
          INSERT INTO public.tbl_citas_medicos   
          (usu_id, citac_id, citm_descripcion, citm_estado)  
          VALUES ($1, $2, $3, 1)  
          RETURNING citm_id  
        `;  
        const medicoResult = await queryRunner.query(medicoQuery, [  
          usu_id,   
          citac_id,   
          citm_descripcion  
        ]);  

        // Verificar si ya tiene el rol de médico  
        const rolExistente = await queryRunner.query(`  
          SELECT *   
          FROM public.tbl_rol_usuario   
          WHERE rol_id = 9 AND usu_id = $1  
        `, [usu_id]);  

        // Insertar en tbl_rol_usuario solo si no existe  
        if (rolExistente.length === 0) {  
          const rolUsuarioQuery = `  
            INSERT INTO public.tbl_rol_usuario   
            (rol_id, usu_id)  
            VALUES (9, $1)  
          `;  
          await queryRunner.query(rolUsuarioQuery, [usu_id]);  
        }  

        // Commit de la transacción  
        await queryRunner.commitTransaction();  

        return {  
          message: 'Médico registrado exitosamente',  
          citm_id: medicoResult[0].citm_id  
        };  
      } catch (insertError) {  
        // Rollback en caso de error  
        await queryRunner.rollbackTransaction();  

        // Manejo de error de restricción única  
        if (insertError.code === '23505') {  
          throw new HttpException(  
            'Ya existe un registro para este usuario',   
            HttpStatus.CONFLICT  
          );  
        }  

        throw new HttpException(  
          'Error al registrar el médico',   
          HttpStatus.INTERNAL_SERVER_ERROR  
        );  
      } finally {  
        await queryRunner.release();  
      }  
    } catch (error) {  
      // Manejo de errores generales  
      throw new HttpException(  
        'Error en el proceso de registro',   
        HttpStatus.INTERNAL_SERVER_ERROR  
      );  
    }  
  }  



  async obtenerHorarioMedico(citm_id: number): Promise<any> {  
    const query = `  
      SELECT   
        ds.citds_nombre AS "Día",  
        hm.cithm_hora_inicio AS "Hora inicio",  
        hm.cithm_hora_fin AS "Hora fin"  
      FROM public.tbl_citas_horarios_medico hm  
      INNER JOIN public.tbl_citas_dias_semana ds ON ds.citds_id = hm.citds_id  
      INNER JOIN public.tbl_citas_medicos m ON m.citm_id = hm.citm_id  
      WHERE m.citm_id = $1 AND m.citm_estado = true  
    `;  

    try {  
      const resultado = await this.configuracionRepository.query(query, [citm_id]);  
      return resultado;  
    } catch (error) {  
      throw new BadRequestException('Error al obtener horario del médico');  
    }  
  }  


 
  async registrarHorarioMedico(dto: CreateHorarioMedicoDto): Promise<any> {  
    console.log('DTO recibido:', dto);  

    const query = `  
    INSERT INTO public.tbl_citas_horarios_medico   
    (citm_id, citds_id, cithm_hora_inicio, cithm_hora_fin, cithm_activo)   
    VALUES ($1, $2, $3, $4, true)  
    RETURNING *  
    `;  
    
    const valores = [  
      dto.citm_id,   
      dto.citds_id,   
      dto.cithm_hora_inicio,  
      dto.cithm_hora_fin  
    ];  

    console.log('Valores a insertar:', valores);  

    try {  
      const resultado = await this.configuracionRepository.query(query, valores);  
      console.log('Resultado de inserción:', resultado);  
      return resultado[0];  
    } catch (error) {  
      console.error('Error completo al registrar horario de médico:', error);  
      throw new BadRequestException(error.message || 'Error al registrar horario de médico');  
    }  
  }  


}  