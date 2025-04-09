import { ApiProperty } from '@nestjs/swagger';

export class CreateConsultoriaDependenciaDto {
  @ApiProperty({ description: 'Nombre de la dependencia', example: 'Dependencia A' })
  cdep_dependencia: string;
}
