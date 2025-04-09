import { IsInt, IsString, IsOptional, IsEmail, Length } from 'class-validator';  
import { ApiProperty } from '@nestjs/swagger';  

export class UpdateConsultoriaDto {  
  @IsInt()  
  ccli_id: number;  

  @IsInt()  
  ctemp_id: number;  

  @IsString()  
  @Length(1, 255)  
  ccli_empresa: string;  

  @IsString()  
  @Length(13, 13)  
  ccli_ruc: string;  

  @IsString()  
  @Length(1, 255)  
  ccli_contacto_nombre: string;  

  @IsEmail()  
  @Length(1, 255)  
  ccli_contacto_correo: string;  

  @IsOptional()  
  @IsString()  
  @Length(1, 20)  
  ccli_contacto_telefono?: string;  

  @IsOptional()  
  @IsString()  
  @Length(1, 100)  
  ccli_provincia?: string; // Nueva propiedad  

  @IsOptional()  
  @IsString()  
  @Length(1, 100)  
  ccli_ciudad?: string; // Nueva propiedad  

  @IsOptional()  
  @IsString()  
  @Length(1, 100)  
  ccli_direccion?: string; // Nueva propiedad  
}