import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tbl_rol_ruta')
export class RolRutaEntity {
  @PrimaryGeneratedColumn()
  roru_id: number;

  @Column('int')
  rol_id: number;

  @Column('int')
  ruta_id: number;

  @Column('bool', { default: true })
  roru_estado: boolean;
}
