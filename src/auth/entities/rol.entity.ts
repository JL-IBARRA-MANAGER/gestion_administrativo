import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tbl_rol')
export class RolEntity {
  @PrimaryGeneratedColumn()
  rol_id: number;

  @Column('varchar')
  rol_nombre: string;

  @Column('varchar', { default: '-' })
  rol_descricion: string;

  @Column('bool', { default: true })
  rol_estado: boolean;

  @CreateDateColumn()
  rol_creado: Date;

  @UpdateDateColumn()
  rol_actualizado: Date;
}
