import { ApiProperty } from '@nestjs/swagger';  
import { IsNotEmpty, IsString } from 'class-validator';  

export class CrearDiaNoLaboralDto {  
  @ApiProperty({  
    description: 'Fecha del día no laborable',  
    example: '2024-12-25'  
  })  
  @IsNotEmpty({ message: 'La fecha es obligatoria' })  
  @IsString()  
  citdnl_fecha: string;  

  @ApiProperty({  
    description: 'Descripción del día no laborable',  
    example: 'Navidad'  
  })  
  @IsNotEmpty({ message: 'La descripción es obligatoria' })  
  @IsString()  
  citdnl_descripcion: string;  

  @ApiProperty({  
    description: 'Usuario de creación',  
    example: 'admin'  
  })  
  @IsNotEmpty({ message: 'El usuario de creación es obligatorio' })  
  @IsString()  
  citdnl_usuario_creacion: string;  
}  