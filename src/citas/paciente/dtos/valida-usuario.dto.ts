
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ValidaUsuarioDto {
  @ApiProperty({
    description: 'Usuario a validar',
    example: 'jibarra'
  })
  @IsNotEmpty()
  @IsString()
  usuario: string;
}
