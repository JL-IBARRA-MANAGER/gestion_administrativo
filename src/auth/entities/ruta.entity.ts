import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tbl_ruta')
export class RutaEntity {
  @PrimaryGeneratedColumn()
  ruta_id: number;

  @Column('varchar')
  ruta_nombre: string;

  @Column('int')
  ruta_padre: number;

  @Column('varchar')
  ruta_ruta: string;

  @Column('varchar')
  ruta_url: string;

  @Column('varchar')
  ruta_component: string;

  @Column('bool', { default: false })
  ruta_indexed: boolean;

  @Column('bool', { default: true })
  ruta_estado: boolean;

  @CreateDateColumn()
  ruta_creada: Date;

  @UpdateDateColumn()
  ruta_actualizada: Date;
}
