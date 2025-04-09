import { IsString, IsOptional } from 'class-validator';  
import { ApiProperty } from '@nestjs/swagger';  

export class CreateConsultoriaDto {  
  @IsString()  
  ccli_empresa: string;  

  @IsString()  
  ccli_ruc: string;  

  @IsString()  
  ccli_contacto_nombre: string;  

  @IsString()  
  ccli_contacto_correo: string;  

  @IsString()  
  ccli_contacto_telefono: string;  

  @IsString()  
  ctemp_id: string; // Será convertido a número en el servicio  

  @IsOptional()  
  @IsString()  
  ccli_provincia?: string; // Nueva propiedad  

  @IsOptional()  
  @IsString()  
  ccli_ciudad?: string; // Nueva propiedad  

  @IsOptional()  
  @IsString()  
  ccli_direccion?: string; // Nueva propiedad  
}  