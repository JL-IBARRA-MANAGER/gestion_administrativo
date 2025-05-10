import { ApiProperty } from '@nestjs/swagger';

export class EstadoCitaDto {
  @ApiProperty({
    description: 'ID del estado de la cita',
    example: 1
  })
  cites_id: number;

  @ApiProperty({
    description: 'Nombre del estado',
    example: 'Programada'
  })
  Estado: string;

  @ApiProperty({
    description: 'Descripción del estado',
    example: 'Cita programada pero no confirmada'
  })
  Detalle: string;
}