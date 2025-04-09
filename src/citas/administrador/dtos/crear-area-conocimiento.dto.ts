import { ApiProperty } from '@nestjs/swagger';  
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';  

export class CrearAreaConocimientoDto {  
  @ApiProperty({   
    example: 'Medicina',   
    description: 'Nombre del área de conocimiento'   
  })  
  @IsString()  
  @IsNotEmpty()  
  @MaxLength(100)  
  citac_nombre: string;  

  @ApiProperty({   
    example: 'Área dedicada al estudio del cuerpo humano, enfermedades y tratamientos',   
    description: 'Descripción del área de conocimiento'   
  })  
  @IsString()  
  @IsNotEmpty()  
  @MaxLength(500)  
  citac_descripcion: string;  
}  