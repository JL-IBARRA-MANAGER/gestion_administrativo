import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';  

@Entity('tbl_global_canton')  
export class Canton {  
  @PrimaryGeneratedColumn()  
  id: number;  

  @Column({ type: 'text' })  
  canton: string;  

  @Column({ type: 'bigint', name: 'id_provincia' })  
  id_provincia: number;  
}