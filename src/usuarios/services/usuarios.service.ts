
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';  
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { CreateUsuarioDto } from '../dtos/create-usuario.dto';

import axios from 'axios';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  async obtenerTodosUsuarios(): Promise<any[]> {
    const query = `
      SELECT 
        usu_id AS "usu_id", 
        usu_nombre AS "Nombre", 
        usu_apellido AS "Apellido", 
        usu_usuario AS "Usuario", 
        usu_correo AS "Correo", 
        usu_estado AS "Estado"
      FROM public.tbl_usuarios
    `;
    return this.usuariosRepository.query(query);
  }

  async obtenerUsuarioPorId(usu_id: number): Promise<any> {
    const query = `
      SELECT 
        usu_id AS "usu_id", 
        usu_nombre AS "Nombre", 
        usu_apellido AS "Apellido", 
        usu_usuario AS "Usuario", 
        usu_correo AS "Correo", 
        usu_estado AS "Estado"
      FROM public.tbl_usuarios
      WHERE usu_id = $1
    `;
    return this.usuariosRepository.query(query, [usu_id]);
  }

  async crearUsuario(createUsuarioDto: CreateUsuarioDto): Promise<any> {
    const query = `
      INSERT INTO public.tbl_usuarios 
      (usu_nombre, usu_apellido, usu_usuario, usu_correo, usu_contrasena, usu_estado, usu_fecha)
      VALUES ($1, $2, $3, $4, $5, 1, CURRENT_TIMESTAMP)
      RETURNING usu_id
    `;
    return this.usuariosRepository.query(query, [
      createUsuarioDto.Nombre,
      createUsuarioDto.Apellido,
      createUsuarioDto.Usuario,
      createUsuarioDto.Correo,
      createUsuarioDto.Identificacion
    ]);
  }

  async desactivarUsuario(usu_id: number): Promise<any> {
    const query = `
      UPDATE public.tbl_usuarios
      SET usu_estado = 0
      WHERE usu_id = $1
    `;
    return this.usuariosRepository.query(query, [usu_id]);
  }


  async verificarUsuario(usu_usuario: string): Promise<any> {  
    // Primero verifica si el usuario existe en la base de datos interna  
    const query = `  
      SELECT EXISTS (  
        SELECT 1   
        FROM public.tbl_usuarios   
        WHERE usu_usuario = $1  
      ) AS "existe"  
    `;  
    const resultado = await this.usuariosRepository.query(query, [usu_usuario]);  
    
    // Si el usuario existe en la base de datos interna  
    if (resultado[0].existe) {  
      const usuarioInterno = await this.usuariosRepository.query(`  
        SELECT   
          usu_id AS "usu_id",   
          usu_nombre AS "Nombre",   
          usu_apellido AS "Apellido",   
          usu_usuario AS "Usuario",  
          usu_correo AS "Correo"  
        FROM public.tbl_usuarios  
        WHERE usu_usuario = $1  
      `, [usu_usuario]);  

      return {  
        bddInterna: true,  
        usuario: usuarioInterno[0]  
      };  
    }  

    // Si no existe en la base de datos interna, consulta la API externa  
    try {  
      const externalApiResponse = await axios.get(  
        `https://api.pucesi.edu.ec/Web-Services/api/search/${usu_usuario}`,  
        {  
          headers: {  
            Authorization: `Basic ${Buffer.from('admin:65pT8HE9T4kQ').toString('base64')}`, // Codificación en Base64 para autenticación  
          },  
        }  
      );  

      // Retorna los datos de la API externa y marca `bddInterna` como false  
      return {  
        bddInterna: false,  
        usuario: externalApiResponse.data  
      };  
    } catch (error) {  
      // Manejo de errores de la API externa  
      if (error.response && error.response.status === 400) {  
        return {  
          bddInterna: false,  
          usuario: null,  
          mensaje: 'Usuario no encontrado en el directorio activo'  
        };  
      }  
      
      throw new HttpException('Error al consultar el directorio activo', HttpStatus.INTERNAL_SERVER_ERROR);  
    }  
  }  

}
