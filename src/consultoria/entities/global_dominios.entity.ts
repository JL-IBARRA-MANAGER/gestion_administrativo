import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';  

@Entity('tbl_global_dominios')  
export class GlobalDominios {  
  @PrimaryGeneratedColumn()  
  dom_id: number;  

  @Column({ type: 'varchar', length: 100 })  
  dom_nombre: string;  

  // Añade las demás columnas según tu tabla  
}