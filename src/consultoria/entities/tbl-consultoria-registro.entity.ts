import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';  

@Entity('tbl_consultoria_registro', { schema: 'public' })  
export class ConsultoriaRegistro {  
  @PrimaryGeneratedColumn()  
  conr_id: number;  

  @Column({ type: 'varchar', length: 100, default: '' })  
  conr_tramite: string;  

  @Column({ type: 'integer' })  
  cdep_id: number;  

  @Column({ type: 'integer' })  
  ccli_id: number;  

  @Column({ type: 'date' })  
  conr_fecha_registro: Date;  

  @Column({ type: 'date', nullable: true })  
  conr_fecha_despacho: Date;  

  @Column({ type: 'varchar', length: 1000, nullable: true })  
  conr_asunto: string;  

  @Column({ type: 'varchar', length: 500, nullable: true })  
  conr_adjunto: string;  

  @Column({ type: 'integer' })  
  conre_id: number;  

  @Column({ type: 'varchar', length: 1000, nullable: true })  
  conr_observacion: string;  
}