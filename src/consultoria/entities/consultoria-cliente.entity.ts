import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';  

@Entity('tbl_consultoria_clientes')  
export class ConsultoriaCliente {  
  @PrimaryGeneratedColumn()  
  ccli_id: number;  

  @Column({ type: 'varchar', length: 255 })  
  ccli_empresa: string;  

  @Column({ type: 'varchar', length: 13 })  
  ccli_ruc: string;  

  @Column({ type: 'varchar', length: 255 })  
  ccli_contacto_nombre: string;  

  @Column({ type: 'varchar', length: 255 })  
  ccli_contacto_correo: string;  

  @Column({ type: 'varchar', length: 20, nullable: true })  
  ccli_contacto_telefono: string;  

  @Column({ type: 'varchar', length: 100, nullable: true }) // Nueva columna  
  ccli_provincia: string;  

  @Column({ type: 'varchar', length: 100, nullable: true }) // Nueva columna  
  ccli_ciudad: string;  

  @Column({ type: 'varchar', length: 100, nullable: true }) // Nueva columna  
  ccli_direccion: string;  

  @Column({ type: 'int' })  
  ctemp_id: number;  

  @Column({ type: 'int', default: 1 })  
  ccli_estado: number;  

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })  
  ccli_fecha_registro: Date;  

  @Column({ type: 'timestamp', nullable: true })  
  ccli_fecha_eliminacion: Date;  
}  