import { Controller, Get, UseGuards } from '@nestjs/common';  
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';  
import { CalendarioService } from '../services/calendario.service';  
import { GlobalCalendarioDto } from '../dtos/global-calendario.dto';   
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';  

@ApiTags('Calendario')  
@ApiBearerAuth()  
@Controller('calendario')  
@UseGuards(JwtAuthGuard)  
export class CalendarioController {  
  constructor(private readonly calendarioService: CalendarioService) {}  

  @Get('horario')  
  @ApiOperation({ summary: 'Horario general de atención' })  
  @ApiResponse({   
    status: 200,   
    description: 'Horario de inicio y fin',   
    type: GlobalCalendarioDto   
  })  
  async getHorarioGeneral(): Promise<GlobalCalendarioDto> {  
    return this.calendarioService.getHorarioGeneral();  
  }  
}