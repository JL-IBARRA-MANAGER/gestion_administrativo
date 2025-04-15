import { ApiProperty } from '@nestjs/swagger';  
import { IsNumber, IsString, IsNotEmpty } from 'class-validator';  

export class CreateHorarioMedicoDto {  
  @ApiProperty({  
    description: 'ID del médico',  
    example: 1  
  })  
  @IsNumber()  
  @IsNotEmpty()  
  citm_id: number;  

  @ApiProperty({  
    description: 'ID del día de semana',  
    example: 1  
  })  
  @IsNumber()  
  @IsNotEmpty()  
  citds_id: number;  

  @ApiProperty({  
    description: 'Hora de inicio del horario',  
    example: '08:00'  
  })  
  @IsString()  
  @IsNotEmpty()  
  cithm_hora_inicio: string;  

  @ApiProperty({  
    description: 'Hora de fin del horario',  
    example: '17:00'  
  })  
  @IsString()  
  @IsNotEmpty()  
  cithm_hora_fin: string;  
}  