// src/citas/administrador/dtos/actualizar-medico-especialidad.dto.ts  
import { ApiProperty } from '@nestjs/swagger';  
import { IsNumber, IsNotEmpty } from 'class-validator';  

export class ActualizarMedicoEspecialidadDto {  
  @ApiProperty({  
    description: 'ID de la especialidad del médico',  
    example: 1  
  })  
  @IsNumber()  
  @IsNotEmpty()  
  citme_id: number;  
}  