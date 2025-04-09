import { ApiProperty } from '@nestjs/swagger';  
import { IsNotEmpty, IsInt, IsDateString, IsOptional, IsString } from 'class-validator';  

export class CreateConsultoriaRegistroDto {  
  @ApiProperty({  
    description: 'Aquí ingresar el id de la dependencia',  
    example: 1,  
  })  
  @IsInt()  
  @IsNotEmpty()  
  cdep_id: number;  

  @ApiProperty({  
    description: 'Aquí ingresar el id del cliente ya registrado',  
    example: 3,  
  })  
  @IsInt()  
  @IsNotEmpty()  
  ccli_id: number;  

  @ApiProperty({  
    description: 'Fecha de registro de la consultoría',  
    example: '2025-01-07',  
  })  
  @IsDateString()  
  @IsNotEmpty()  
  conr_fecha_registro: string;  

  @ApiProperty({  
    description: 'Texto largo para el asunto de la consultoría',  
    example: 'Este es el asunto de la nueva consultoría.',  
  })  
  @IsString()  
  @IsOptional()  
  conr_asunto?: string;  

  @ApiProperty({  
    description: 'Archivo adjunto opcional para la consultoría (pdf, docx, xlsx, png, jpg)',  
    type: 'string',  
    format: 'binary',  
  })  
  @IsOptional()  
  file?: any; // Nota: Swagger lo describe para la documentación, no se valida directamente aquí  
}