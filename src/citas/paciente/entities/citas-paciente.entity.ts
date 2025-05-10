// src/citas/paciente/entities/citas-paciente.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tbl_citas_pacientes')
export class CitasPaciente {
  @PrimaryGeneratedColumn()
  citp_id: number;

  @Column()
  citp_cedula: string;

  @Column()
  citp_usuario: string;

  @Column()
  citp_nombres: string;

  @Column()
  citp_correo: string;

  @Column()
  citp_telefono: string;

  @Column()
  citp_direccion: string;
}