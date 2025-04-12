
import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUsuarioDto {
  @ApiProperty({ description: 'ID del usuario a actualizar' })
  @IsNumber()
  usu_id: number;
}
