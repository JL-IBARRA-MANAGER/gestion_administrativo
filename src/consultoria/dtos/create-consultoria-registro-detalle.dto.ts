import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class CreateConsultoriaRegistroDetalleDto {
  @ApiProperty({
    description: 'ID único del detalle de la consultoría',
    example: 1,
  })
  @IsNumber()
  @IsOptional() // Esto depende de que no sea requerido durante la creación.
  conrd_id?: number;

  @ApiProperty({
    description: 'Tipo de trámite de la consultoría',
    example: 'Asesoría Legal',
  })
  @IsString()
  @IsNotEmpty()
  conr_tramite: string;

  @ApiProperty({
    description: 'Fecha de despacho de la consultoría',
    example: '2025-01-01',
    type: 'string',
    format: 'date-time',
  })
  @IsDate() // Nota: Asegúrate de que el dato recibido sea transformado como fecha en el controlador.
  @IsNotEmpty()
  conr_fecha_despacho: Date;

  @ApiProperty({
    description: 'ID relacionado a la consultoría general',
    example: 123,
  })
  @IsNumber()
  @IsNotEmpty()
  conre_id: number;

  @ApiProperty({
    description: 'Observaciones relacionadas a la consultoría',
    example: 'El trámite se resolvió satisfactoriamente.',
  })
  @IsString()
  @IsOptional()
  conr_observacion?: string;

  @ApiProperty({
    description: 'Archivo adjunto relacionado a la consultoría (enviado como archivo)',
    type: 'string',
    format: 'binary', // Necesario para Swagger para aceptar archivos con multipart/form-data.
  })
  @IsOptional()
  conrd_adjunto?: string; // Se procesará más adelante como una ruta al archivo.
}