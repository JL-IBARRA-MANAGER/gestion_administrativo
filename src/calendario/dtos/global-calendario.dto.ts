import { ApiProperty } from '@nestjs/swagger';  

export class GlobalCalendarioDto {  
  @ApiProperty({ description: 'Hora de inicio del calendario' })  
  gcal_hora_inicio: string;  

  @ApiProperty({ description: 'Hora de fin del calendario' })  
  gcal_hora_fin: string;  
}  