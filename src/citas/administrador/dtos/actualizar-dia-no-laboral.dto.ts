import { ApiProperty } from '@nestjs/swagger';  
import { IsOptional, IsString } from 'class-validator';  

export class ActualizarDiaNoLaboralDto {  
  @ApiProperty({   
    description: 'Fecha del día no laborable',   
    required: false,  
    example: '2024-12-25'   
  })  
  @IsOptional()  
  @IsString()  
  fecha?: string;  

  @ApiProperty({   
    description: 'Descripción del día no laborable',   
    required: false,  
    example: 'Navidad'   
  })  
  @IsOptional()  
  @IsString()  
  descripcion?: string;  
}  