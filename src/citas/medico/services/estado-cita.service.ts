import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm'; 
import { EstadoCitaDto } from '../dtos/estado-cita.dto';
import { CitasMedicoDto } from '../dtos/citas-medico.dto';
import { ActualizarCitaDto } from '../dtos/actualizar-cita.dto';



@Injectable()
export class EstadoCitaService {
  constructor(
    private readonly dataSource: DataSource
  ) {}

  async obtenerEstadosCitas(): Promise<EstadoCitaDto[]> {
    try {
      const query = `
        SELECT 
          cites_id, 
          cites_nombre AS "Estado", 
          cites_descripcion AS "Detalle"
        FROM public.tbl_citas_estados
        ORDER BY cites_id ASC
      `;
      
      const resultado = await this.dataSource.query(query);
      
      return resultado;
    } catch (error) {
      throw new HttpException(
        'Error al obtener estados de citas', 
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }



  async obtenerCitasMedico(citm_id: number, cites_id: number): Promise<CitasMedicoDto[]> {
    try {
      const query = `
        SELECT 
          cm.citmed_id,
          p.citp_nombres AS "Paciente",
          cm.citmed_fecha AS "Fecha",
          cm.citmed_hora_inicio AS "Hora inicio",
          cm.citmed_hora_fin AS "Hora fin",
          cm.citmed_duracion AS "Tiempo",
          cm.citmed_tipo AS "Modalidad",
          e.cites_nombre AS "Estado",
          cm.citmed_observaciones AS "Observación"
        FROM public.tbl_citas_medicas cm
        INNER JOIN public.tbl_citas_pacientes p ON cm.citp_id = p.citp_id
        INNER JOIN public.tbl_citas_estados e ON cm.cites_id = e.cites_id
        WHERE cm.citm_id = $1 AND cm.cites_id = $2
      `;
      
      const resultado = await this.dataSource.query(query, [citm_id, cites_id]);
      
      return resultado;
    } catch (error) {
      throw new HttpException(
        'Error al obtener citas del médico', 
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }


  async actualizarEstadoCita(citmed_id: number, cites_id: number): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    
    try {
      // Iniciar transacción
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // Primero, validar la existencia de la cita y sus detalles
      const queryValidacion = `
        SELECT 
          citmed_fecha, 
          cites_id AS estado_actual
        FROM public.tbl_citas_medicas
        WHERE citmed_id = $1
      `;
      
      const [citaExistente] = await this.dataSource.query(queryValidacion, [citmed_id]);

      // Verificar si la cita existe
      if (!citaExistente) {
        throw new HttpException(
          'Cita no encontrada', 
          HttpStatus.NOT_FOUND
        );
      }

      // Validación específica para cambio a estado 4
      if (cites_id === 4) {
        // Obtener la fecha actual
        const fechaActual = new Date().toISOString().split('T')[0];
        
        // Comparar fechas
        if (new Date(fechaActual) < new Date(citaExistente.citmed_fecha)) {
          throw new HttpException(
            'No se puede cambiar al estado Finalizado para una cita que aún no finaliza', 
            HttpStatus.BAD_REQUEST
          );
        }
      }

      // Consulta para actualizar el estado de la cita
      const query = `
        UPDATE public.tbl_citas_medicas
        SET cites_id = $1
        WHERE citmed_id = $2
        RETURNING *
      `;
      
      const resultado = await this.dataSource.query(query, [cites_id, citmed_id]);
      
      // Verificar si se actualizó algún registro
      if (resultado.length === 0) {
        throw new HttpException(
          'No se pudo actualizar la cita', 
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      // Commit de la transacción
      await queryRunner.commitTransaction();

      return {
        mensaje: 'Estado de cita actualizado exitosamente',
        cita: resultado[0]
      };
    } catch (error) {
      // Rollback en caso de error
      await queryRunner.rollbackTransaction();
      
      throw new HttpException(
        error.message || 'Error al actualizar el estado de la cita', 
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    } finally {
      // Liberar el query runner
      await queryRunner.release();
    }
  }


}