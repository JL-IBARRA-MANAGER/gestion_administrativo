import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolEntity } from './entities/rol.entity';
import { RutaEntity } from './entities/ruta.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import axios from 'axios';
import * as https from 'https'; 

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RolEntity)
    private readonly rolRepo: Repository<RolEntity>,
    @InjectRepository(RutaEntity)
    private readonly rutaRepo: Repository<RutaEntity>,
    private readonly jwtService: JwtService,
  ) {}


// Método privado para obtener rutas por rol  
  private async obtenerRutasPorRol(rolId: number) {  
    if (!rolId) return []; // Manejar caso de rol nulo  

    const rutas = await this.rutaRepo.query(  
      `SELECT DISTINCT  
        ruta.ruta_id,   
        ruta.ruta_padre,   
        ruta.ruta_nombre,   
        ruta.ruta_ruta,   
        ruta.ruta_url,   
        ruta.ruta_component,   
        ruta.ruta_indexed,   
        rr.roru_privilegio   
      FROM public.tbl_rol_ruta AS rr   
      INNER JOIN tbl_ruta ruta ON ruta.ruta_id = rr.ruta_id  
      WHERE rr.rol_id = $1`,  
      [rolId]  
    );  
    return rutas;  
  }  

  async login(loginDto: LoginDto) {  
    try {  
      let directorioActivoResult = null;  
      let usuario = null, rol = null, rutas = [];  

      // 1. Intentar validación con directorio activo  
      try {  
        directorioActivoResult = await this.validateExternalDirectory(  
          loginDto.username,   
          loginDto.password  
        );  
      } catch (error) {  
        console.warn('Fallo en validación de directorio activo', error);  
      }  

      // 2. Escenario de validación externa exitosa  
      if (directorioActivoResult && directorioActivoResult.success) {  
        const grupos = directorioActivoResult.grupos || [];  
        const esEstudiante = grupos.some(grupo =>   
          ['Estudiantes', 'EstudiantesInscritos'].includes(grupo)  
        );  
        const esDocente = grupos.some(grupo =>   
          ['Docentes', 'docentesMeet'].includes(grupo)  
        );  

        // Buscar usuario en base de datos local  
        const usuarioLocalQuery = await this.rolRepo.query(  
          `SELECT   
            u.usu_id,   
            u.usu_nombre,   
            u.usu_apellido,   
            u.usu_usuario,  
            r.rol_id,  
            r.rol_nombre  
          FROM public.tbl_usuarios u  
          LEFT JOIN public.tbl_rol_usuario ru ON u.usu_id = ru.usu_id  
          LEFT JOIN public.tbl_rol r ON ru.rol_id = r.rol_id  
          WHERE u.usu_usuario = $1`,  
          [loginDto.username]  
        );  

        // Buscar rol de grupo (Estudiantes o Docentes)  
        const rolGrupoQuery = await this.rolRepo.query(  
          `SELECT rol_id, rol_nombre   
          FROM public.tbl_rol   
          WHERE rol_nombre = $1`,  
          [esEstudiante ? 'Estudiantes' : 'Docentes']  
        );  

        // Obtener rutas de grupo  
        let rutasGrupo = [];  
        if (rolGrupoQuery.length > 0) {  
          rutasGrupo = await this.obtenerRutasPorRol(rolGrupoQuery[0].rol_id);  
        }  

        // Obtener rutas de usuario local si existe  
        let rutasUsuario = [];  
        if (usuarioLocalQuery.length > 0) {  
          usuario = {  
            usu_id: usuarioLocalQuery[0].usu_id,  
            usu_nombre: usuarioLocalQuery[0].usu_nombre,  
            usu_apellido: usuarioLocalQuery[0].usu_apellido,  
            usu_usuario: usuarioLocalQuery[0].usu_usuario  
          };  

          rol = {  
            rol_id: usuarioLocalQuery[0].rol_id,  
            rol_nombre: usuarioLocalQuery[0].rol_nombre  
          };  

          // Obtener rutas específicas del usuario  
          if (rol.rol_id) {  
            rutasUsuario = await this.obtenerRutasPorRol(rol.rol_id);  
          }  
        } else {  
          // Si no existe usuario local, usar solo rutas de grupo  
          usuario = {  
            usu_id: null,  
            usu_nombre: directorioActivoResult.nombres.split(' ')[0],  
            usu_apellido: directorioActivoResult.nombres.split(' ').slice(1).join(' '),  
            usu_usuario: loginDto.username  
          };  

          if (rolGrupoQuery.length > 0) {  
            rol = {  
              rol_id: rolGrupoQuery[0].rol_id,  
              rol_nombre: rolGrupoQuery[0].rol_nombre  
            };  
          }  
        }  

        // Combinar rutas sin duplicados  
        rutas = [  
          ...rutasGrupo,  
          ...rutasUsuario.filter(  
            rutaUsuario => !rutasGrupo.some(ruta => ruta.ruta_id === rutaUsuario.ruta_id)  
          )  
        ];  
      }   
      // 3. Escenario de fallo en validación externa o no directorio activo  
      else {  
        // Validar contra base de datos local  
        const usuarioLocalQuery = await this.rolRepo.query(  
          `SELECT   
            u.usu_id,   
            u.usu_nombre,   
            u.usu_apellido,   
            u.usu_usuario,  
            r.rol_id,  
            r.rol_nombre  
          FROM public.tbl_usuarios u  
          LEFT JOIN public.tbl_rol_usuario ru ON u.usu_id = ru.usu_id  
          LEFT JOIN public.tbl_rol r ON ru.rol_id = r.rol_id  
          WHERE u.usu_usuario = $1 AND u.usu_contrasena = $2`,  
          [loginDto.username, loginDto.password]  
        );  

        if (usuarioLocalQuery.length > 0) {  
          // Usuario válido localmente  
          usuario = {  
            usu_id: usuarioLocalQuery[0].usu_id,  
            usu_nombre: usuarioLocalQuery[0].usu_nombre,  
            usu_apellido: usuarioLocalQuery[0].usu_apellido,  
            usu_usuario: usuarioLocalQuery[0].usu_usuario  
          };  

          rol = {  
            rol_id: usuarioLocalQuery[0].rol_id,  
            rol_nombre: usuarioLocalQuery[0].rol_nombre  
          };  

          // Obtener rutas del rol local  
          rutas = await this.obtenerRutasPorRol(rol.rol_id);  
        } else {  
          // No hay coincidencia ni en directorio externo ni en base de datos local  
          throw new UnauthorizedException('Usuario no registrado o usuario/clave mal ingresados');  
        }  
      }  

      // 4. Validación final de autorización  
      if (!rutas || rutas.length === 0) {  
        throw new UnauthorizedException('Usuario no registrado o sin rutas asignadas');  
      }  

      // 5. Preparar payload y token  
      const payload = {  
        sub: usuario.usu_id || directorioActivoResult?.cedula,  
        username: loginDto.username  
      };  

      // 6. Generar token  
      const token = await this.jwtService.signAsync(payload);  

      // 7. Preparar respuesta final  
      return {  
        usuario,  
        rol,  
        rutas,  
        directorioActivo: directorioActivoResult ? {  
          cedula: directorioActivoResult.cedula,  
          correo: directorioActivoResult.correo,  
          grupos: directorioActivoResult.grupos,  
          nombres: directorioActivoResult.nombres  
        } : null,  
        token: token  
      };  

    } catch (error) {  
      console.error('Error en el proceso de login', error);  
      throw new UnauthorizedException('Error en el proceso de autenticación');  
    }  
  }  

  // Método de validación de directorio activo  
  private async validateExternalDirectory(username: string, password: string) {  
    try {  
      const httpsAgent = new https.Agent({  
        rejectUnauthorized: false // SOLO PARA DESARROLLO  
      });  

      const externalApiResponse = await axios.post(  
        'https://api.pucesi.edu.ec/Web-Services/api/auth/data',  
        { usuario: username, password: password },  
        {  
          headers: {  
            Authorization: `Basic ${Buffer.from('admin:65pT8HE9T4kQ').toString('base64')}`,  
          },  
          httpsAgent  
        }  
      );  

      if (externalApiResponse.data && externalApiResponse.data.nombres) {  
        return {  
          success: true,  
          nombres: externalApiResponse.data.nombres,  
          cedula: externalApiResponse.data.cedula,  
          correo: externalApiResponse.data.correo,  
          grupos: externalApiResponse.data.grupos,  
        };  
      } else {  
        return { success: false, message: 'Credenciales inválidas en directorio activo' };  
      }  
    } catch (error) {  
      console.error('Error en validación de directorio activo', error);  
      return { success: false, message: 'Error de conexión con directorio activo' };  
    }  
  }  

}