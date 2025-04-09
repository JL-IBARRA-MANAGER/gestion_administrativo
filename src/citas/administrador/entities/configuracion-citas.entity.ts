import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tbl_citas_configuracion')
export class ConfiguracionCitas {
  @PrimaryGeneratedColumn()
  citc_id: number;

  @Column({ type: 'integer', default: 60 })
  citc_tiempo_maximo_cita: number;

  @Column({ type: 'integer', default: 30 })
  citc_intervalo_cita: number;

  @Column({ type: 'time', default: '08:00:00' })
  citc_hora_inicio: string;

  @Column({ type: 'time', default: '20:00:00' })
  citc_hora_fin: string;
}