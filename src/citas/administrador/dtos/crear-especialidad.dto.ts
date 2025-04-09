
import { ApiProperty } from '@nestjs/swagger';  
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';  

export class CrearEspecialidadDto {  
  @ApiProperty({   
    example: 1,   
    description: 'ID del área de conocimiento'   
  })  
  @IsNumber()  
  @IsNotEmpty()  
  citac_id: number;  

  @ApiProperty({   
    example: 'Dermatología',   
    description: 'Nombre de la especialidad'   
  })  
  @IsString()  
  @IsNotEmpty()  
  @MaxLength(100)  
  citcat_nombre: string;  

  @ApiProperty({   
    example: 'Especialidad médica enfocada en el diagnóstico y tratamiento de condiciones de la piel',   
    description: 'Descripción de la especialidad'   
  })  
  @IsString()  
  @IsNotEmpty()  
  @MaxLength(500)  
  citcat_descripcion: string;  
} 