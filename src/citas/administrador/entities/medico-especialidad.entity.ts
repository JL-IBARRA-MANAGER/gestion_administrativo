import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';  

@Entity('tbl_citas_medicos_especialidad')  
export class MedicoEspecialidad {  
  @PrimaryGeneratedColumn()  
  citme_id: number;  

  @Column()  
  citm_id: number;  

  @Column()  
  citcat_id: number;  

  @Column()  
  citme_estado: number;  
}  
