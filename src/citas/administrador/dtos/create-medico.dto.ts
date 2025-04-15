
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreateMedicoDto {
  @ApiProperty({ description: 'ID del usuario' })
  @IsNotEmpty()
  @IsNumber()
  usu_id: number;

  @ApiProperty({ description: 'ID del área de conocimiento' })
  @IsNotEmpty()
  @IsNumber()
  citac_id: number;

  @ApiProperty({ description: 'Descripción del médico' })
  @IsNotEmpty()
  @IsString()
  citm_descripcion: string;
}
