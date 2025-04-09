import { ApiProperty } from '@nestjs/swagger';

export class UpdateConsultoriaDependenciaDto {
  @ApiProperty({ description: 'ID de la dependencia a editar', example: 1 })
  cdep_id: number;

  @ApiProperty({ description: 'Nuevo nombre de la dependencia', example: 'Dependencia B' })
  cdep_dependencia: string;
}
