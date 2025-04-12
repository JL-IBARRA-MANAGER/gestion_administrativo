
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tbl_usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  usu_id: number;

  @Column()
  usu_nombre: string;

  @Column()
  usu_apellido: string;

  @Column()
  usu_usuario: string;

  @Column()
  usu_contrasena: string;

  @Column()
  usu_fecha: Date;

  @Column()
  usu_estado: number;

  @Column()
  usu_correo: string;
}
