import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteConsultoriaDto {
  @IsInt()
  @ApiProperty({ example: 1, description: 'ID de la consultoría a eliminar' })
  ccli_id: number;
}
