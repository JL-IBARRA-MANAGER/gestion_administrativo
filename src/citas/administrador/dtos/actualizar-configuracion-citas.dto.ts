import { IsOptional, IsInt, IsString } from 'class-validator';

export class ActualizarConfiguracionCitasDto {
  @IsOptional()
  @IsInt()
  citc_tiempo_maximo_cita?: number;

  @IsOptional()
  @IsInt()
  citc_intervalo_cita?: number;

  @IsOptional()
  @IsString()
  citc_hora_inicio?: string;

  @IsOptional()
  @IsString()
  citc_hora_fin?: string;
}