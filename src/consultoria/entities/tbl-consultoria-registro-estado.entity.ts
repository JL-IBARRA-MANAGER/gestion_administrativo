import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';  

@Entity('tbl_consultoria_registro_estado', { schema: 'public' })  
export class ConsultoriaRegistroEstado {  
  @PrimaryGeneratedColumn()  
  conre_id: number;  

  @Column({ type: 'varchar', length: 100, default: '' })  
  conre_nombre: string;  

  @Column({ type: 'integer', default: 1 })  
  conre_fase: number;  

  @Column({ type: 'integer', default: 1 })  
  conre_estado: number;  
}