import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class HorariosDisponiblesDto {
  @ApiProperty({
    description: 'ID del médico',
    example: 1
  })
  @IsNotEmpty()
  @IsNumber()
  citm_id: number;

  @ApiProperty({
    description: 'Fecha para consultar horarios disponibles',
    example: '2025-05-12'
  })
  @IsNotEmpty()
  @IsString()
  fecha: string;
}