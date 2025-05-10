import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsDate } from 'class-validator';

export class CitasMedicoDto {
  @ApiProperty({
    description: 'Nombre del paciente',
    example: 'Juan Pérez'
  })
  @IsString()
  Paciente: string;

  @ApiProperty({
    description: 'Fecha de la cita',
    example: '2025-05-12'
  })
  @IsString()
  Fecha: string;

  @ApiProperty({
    description: 'Hora de inicio de la cita',
    example: '10:00:00'
  })
  @IsString()
  "Hora inicio": string;

  @ApiProperty({
    description: 'Hora de fin de la cita',
    example: '11:00:00'
  })
  @IsString()
  "Hora fin": string;

  @ApiProperty({
    description: 'Duración de la cita',
    example: '60'
  })
  @IsNumber()
  Tiempo: number;

  @ApiProperty({
    description: 'Modalidad de la cita',
    example: 'Presencial'
  })
  @IsString()
  Modalidad: string;

  @ApiProperty({
    description: 'Estado de la cita',
    example: 'Pendiente'
  })
  @IsString()
  Estado: string;

  @ApiProperty({
    description: 'Observaciones de la cita',
    example: 'Paciente necesita seguimiento'
  })
  @IsString()
  Observación: string;
}