import { ApiProperty } from '@nestjs/swagger';  
import { IsNumber, IsNotEmpty } from 'class-validator';  

export class CrearMedicoEspecialidadDto {  
  @ApiProperty({  
    description: 'ID del usuario médico, citm_id',  
    example: 1  
  })  
  @IsNumber()  
  @IsNotEmpty()  
  citm_id: number;  

  @ApiProperty({  
    description: 'ID de la categoría/especialidad',  
    example: 1  
  })  
  @IsNumber()  
  @IsNotEmpty()  
  citcat_id: number;  
}  