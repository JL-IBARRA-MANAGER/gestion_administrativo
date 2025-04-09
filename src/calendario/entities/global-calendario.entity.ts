import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';  
import { ApiProperty } from '@nestjs/swagger';  

@Entity('tbl_global_calendario')  
export class GlobalCalendario {  
  @PrimaryGeneratedColumn()  
  @ApiProperty({ description: 'ID del calendario' })  
  gcal_id: number;  

  @Column({ type: 'time' })  
  @ApiProperty({ description: 'Hora de inicio del calendario' })  
  gcal_hora_inicio: string;  

  @Column({ type: 'time' })  
  @ApiProperty({ description: 'Hora de fin del calendario' })  
  gcal_hora_fin: string;  
}  