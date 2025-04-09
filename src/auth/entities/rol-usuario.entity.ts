import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tbl_rol_usuario')
export class RolUsuarioEntity {
  @PrimaryGeneratedColumn()
  rous_id: number;

  @Column('int')
  rol_id: number;

  @Column('int')
  usu_id: number;

  @Column('bool')
  rous_estado: boolean;
}
