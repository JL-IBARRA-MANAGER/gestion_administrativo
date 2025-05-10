import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm'; 
import { CitasPaciente } from '../entities/citas-paciente.entity';
import { RegistroPacienteDto } from '../dtos/registro-paciente.dto';

@Injectable()
export class CitasService {
  constructor(
    @InjectRepository(CitasPaciente)
    private citasPacienteRepository: Repository<CitasPaciente>,
    private readonly dataSource: DataSource
  ) {}

  async validarPacienteUsuario(usuario: string) {
    try {
      const resultado = await this.citasPacienteRepository.findOne({
        where: { citp_usuario: usuario }
      });
      
      return {
        paciente: !!resultado,
        datos: resultado || null
      };
    } catch (error) {
      throw new HttpException(
        'Error al validar usuario paciente', 
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }


  async registrarPaciente(datosRegistro: RegistroPacienteDto) {
    try {
      // Verificar si el usuario ya existe
      const usuarioExistente = await this.citasPacienteRepository.findOne({
        where: { citp_usuario: datosRegistro.citp_usuario }
      });

      if (usuarioExistente) {
        throw new HttpException(
          'El usuario ya está registrado', 
          HttpStatus.CONFLICT
        );
      }

      // Crear nueva entidad de paciente
      const nuevoPaciente = this.citasPacienteRepository.create(datosRegistro);
      
      // Guardar en la base de datos
      const pacienteGuardado = await this.citasPacienteRepository.save(nuevoPaciente);

      return {
        mensaje: 'Paciente registrado exitosamente',
        datos: pacienteGuardado
      };
    } catch (error) {
      // Manejo de errores
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        'Error al registrar paciente', 
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }



  async obtenerHorariosDisponiblesMedico(citm_id: number, fecha: string) {
    try {
      // PostgreSQL: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      const queryDia = `
        SELECT 
          citds_id,
          CASE 
            WHEN EXTRACT(DOW FROM DATE '${fecha}') = 0 THEN 7
            ELSE EXTRACT(DOW FROM DATE '${fecha}')
          END as dia_semana
        FROM public.tbl_citas_dias_semana 
        WHERE 
          CASE 
            WHEN EXTRACT(DOW FROM DATE '${fecha}') = 0 THEN 7
            ELSE EXTRACT(DOW FROM DATE '${fecha}')
          END = citds_id
      `;
      const resultadoDia = await this.dataSource.query(queryDia);      
      if (resultadoDia.length === 0) {
        throw new HttpException(
          'No se pudo determinar el día de la semana', 
          HttpStatus.BAD_REQUEST
        );
      }
      
      const diaSemana = resultadoDia[0].citds_id;

      // Obtener TODOS los horarios del médico para el día
      const queryHorariosMedico = `
        SELECT 
          ds.citds_nombre AS "Dia",
          hm.cithm_hora_inicio,
          hm.cithm_hora_fin
        FROM public.tbl_citas_horarios_medico hm
        INNER JOIN public.tbl_citas_dias_semana ds ON ds.citds_id = hm.citds_id
        WHERE hm.citm_id = $1 AND hm.citds_id = $2 AND hm.cithm_activo = true
        ORDER BY hm.cithm_hora_inicio
      `;
      const horariosMedico = await this.dataSource.query(queryHorariosMedico, [citm_id, diaSemana]);

      // Obtener citas existentes para el médico en la fecha
      const queryCitasExistentes = `
        SELECT 
          citmed_hora_inicio,
          citmed_hora_fin
        FROM public.tbl_citas_medicas
        WHERE citm_id = $1 AND citmed_fecha = $2
        ORDER BY citmed_hora_inicio
      `;
      const citasExistentes = await this.dataSource.query(queryCitasExistentes, [citm_id, fecha]);

      // Calcular horarios disponibles
      const horariosDisponibles = this.calcularHorariosDisponibles(
        horariosMedico,
        citasExistentes
      );

      return horariosDisponibles;
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al obtener horarios disponibles', 
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private calcularHorariosDisponibles(horariosMedico, citasExistentes) {
    if (!horariosMedico || horariosMedico.length === 0) {
      return { 
        Dia: 'N/A', 
        horarios: [] 
      };
    }

    // Convertir horarios a objetos de tiempo
    const horariosDisponibles = [];

    // Procesar cada horario del médico
    horariosMedico.forEach(horarioMedico => {
      const horaInicio = this.convertirHora(horarioMedico.cithm_hora_inicio);
      const horaFin = this.convertirHora(horarioMedico.cithm_hora_fin);

      // Ordenar citas existentes
      const citasOrdenadas = citasExistentes
        .map(cita => ({
          inicio: this.convertirHora(cita.citmed_hora_inicio),
          fin: this.convertirHora(cita.citmed_hora_fin)
        }))
        .sort((a, b) => a.inicio.localeCompare(b.inicio));

      // Calcular horarios disponibles para este horario específico
      let ultimoHorarioLibre = horaInicio;

      // Manejar caso de no tener citas
      if (citasOrdenadas.length === 0) {
        horariosDisponibles.push({
          hora_inicio: horaInicio,
          hora_fin: horaFin
        });
        return;
      }

      citasOrdenadas.forEach(cita => {
        // Si hay espacio antes de la cita
        if (ultimoHorarioLibre < cita.inicio) {
          horariosDisponibles.push({
            hora_inicio: ultimoHorarioLibre,
            hora_fin: cita.inicio
          });
        }
        // Actualizar último horario libre
        ultimoHorarioLibre = cita.fin > ultimoHorarioLibre ? cita.fin : ultimoHorarioLibre;
      });

      // Añadir horario final si queda espacio
      if (ultimoHorarioLibre < horaFin) {
        horariosDisponibles.push({
          hora_inicio: ultimoHorarioLibre,
          hora_fin: horaFin
        });
      }
    });

    return {
      Dia: horariosMedico[0].Dia,
      horarios: horariosDisponibles
    };
  }

  private convertirHora(hora: string): string {
    // Asegurar formato HH:MM:SS
    if (hora.length === 5) hora += ':00';
    return hora;
  }

}