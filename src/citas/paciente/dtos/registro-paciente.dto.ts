import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';

export class RegistroPacienteDto {
  @ApiProperty({
    description: 'Cédula del paciente',
    example: '1234567890'
  })
  @IsNotEmpty()
  @IsString()
  citp_cedula: string;

  @ApiProperty({
    description: 'Usuario del paciente',
    example: 'juan.perez'
  })
  @IsNotEmpty()
  @IsString()
  citp_usuario: string;

  @ApiProperty({
    description: 'Nombres del paciente',
    example: 'Juan Pérez'
  })
  @IsNotEmpty()
  @IsString()
  citp_nombres: string;

  @ApiProperty({
    description: 'Correo electrónico del paciente',
    example: 'juan.perez@example.com'
  })
  @IsNotEmpty()
  @IsEmail()
  citp_correo: string;

  @ApiProperty({
    description: 'Teléfono del paciente',
    example: '0987654321'
  })
  @IsNotEmpty()
  @IsString()
  citp_telefono: string;

  @ApiProperty({
    description: 'Dirección del paciente',
    example: 'Av. Siempre Viva 123'
  })
  @IsOptional()
  @IsString()
  citp_direccion?: string;
}