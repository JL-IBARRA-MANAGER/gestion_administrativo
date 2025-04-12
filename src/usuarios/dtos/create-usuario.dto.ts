
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsuarioDto {
  @ApiProperty({ description: 'Nombre del usuario' })
  @IsNotEmpty()
  @IsString()
  Nombre: string;

  @ApiProperty({ description: 'Apellido del usuario' })
  @IsNotEmpty()
  @IsString()
  Apellido: string;

  @ApiProperty({ description: 'Nombre de usuario' })
  @IsNotEmpty()
  @IsString()
  Usuario: string;

  @ApiProperty({ description: 'Correo electrónico del usuario' })
  @IsNotEmpty()
  @IsEmail()
  Correo: string;

  @ApiProperty({ description: 'Identificación del usuario' })
  @IsNotEmpty()
  @IsString()
  Identificacion: string;
}
