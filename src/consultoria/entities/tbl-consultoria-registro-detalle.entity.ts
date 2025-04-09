import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tbl_consultoria_registro_detalle')
export class ConsultoriaRegistroDetalle {
  @PrimaryGeneratedColumn()
  conrd_id: number;

  @Column({ type: 'varchar', length: 100 })
  conr_tramite: string;

  @Column({ type: 'date', nullable: true })
  conr_fecha_despacho: Date;

  @Column({ type: 'int' })
  conre_id: number;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  conr_observacion: string;
}
