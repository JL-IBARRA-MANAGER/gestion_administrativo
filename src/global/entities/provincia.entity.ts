import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';  

@Entity('tbl_global_provincia')  
export class Provincia {  
  @PrimaryGeneratedColumn()  
  id: number;  

  @Column({ type: 'text' })  
  provincia: string;  
}