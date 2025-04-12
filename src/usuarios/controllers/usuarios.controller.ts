
import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Body, 
  Param, 
  Query
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { UsuariosService } from '../services/usuarios.service';
import { CreateUsuarioDto } from '../dtos/create-usuario.dto';
import { UpdateUsuarioDto } from '../dtos/update-usuario.dto';

@ApiTags('Usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get('usuarios')
  @ApiOperation({ summary: 'Obtiene todos los usuarios' })
  async obtenerTodosUsuarios() {
    return this.usuariosService.obtenerTodosUsuarios();
  }

  @Get('usuario')
  @ApiOperation({ summary: 'Detalles de un usuario por ID' })
  @ApiQuery({ name: 'usu_id', type: Number, description: 'ID del usuario' })
  async obtenerUsuarioPorId(@Query('usu_id') usu_id: number) {
    return this.usuariosService.obtenerUsuarioPorId(usu_id);
  }

  @Post('usuario')
  @ApiOperation({ summary: 'Registro de un usuario' })
  async crearUsuario(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.crearUsuario(createUsuarioDto);
  }

  @Put('usuario')
  @ApiOperation({ summary: 'Actualiza el estado del usuario a desactivado' })
  @ApiQuery({ name: 'usu_id', type: Number, description: 'ID del usuario a desactivar' })
  async desactivarUsuario(@Query('usu_id') usu_id: number) {
    return this.usuariosService.desactivarUsuario(usu_id);
  }

  @Get('usuario/verificar')  
  @ApiOperation({ summary: 'Verifica si un usuario existe en la base de datos interna, si no consulta la API externa' })  
  @ApiQuery({ name: 'usu_usuario', type: String, description: 'Nombre de usuario a verificar' })  
  async verificarUsuario(@Query('usu_usuario') usu_usuario: string) {  
    return this.usuariosService.verificarUsuario(usu_usuario);  
  }  


}
