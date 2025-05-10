import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ActualizarCitaDto {
  @ApiProperty({
    description: 'ID de la cita médica',
    example: 1
  })
  @IsNumber()
  citmed_id: number;

  @ApiProperty({
    description: 'Nuevo ID de estado de la cita',
    example: 2
  })
  @IsNumber()
  cites_id: number;
}