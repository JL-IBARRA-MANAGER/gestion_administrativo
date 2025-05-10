import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('tbl_citas_estados')
export class EstadoCita {
  @PrimaryColumn()
  cites_id: number;

  @Column()
  cites_nombre: string;

  @Column()
  cites_descripcion: string;
}