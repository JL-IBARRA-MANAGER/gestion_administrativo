import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('tbl_consultoria_dependencias')
export class ConsultoriaDependencia {
  @PrimaryGeneratedColumn()
  cdep_id: number;

  @Column({ type: 'varchar', length: 200 })
  cdep_dependencia: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  cdep_fecha_registro: Date;

  @Column({ type: 'int', default: 1 })
  cdep_estado: number;
}
