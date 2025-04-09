import { ApiProperty } from '@nestjs/swagger';  

export class UpdateConsultoriaDependenciaEliminarDto {  
  @ApiProperty({  
    description: 'ID de la dependencia a eliminar',  
    example: 1,  
    type: Number,  
  })  
  cdep_id: number;  
}  