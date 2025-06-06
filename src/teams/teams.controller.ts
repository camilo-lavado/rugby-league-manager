import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { QueryTeamDto } from './dto/query-team.dto';
import { Team } from './entities/team.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { User } from '../users/entities/user.entity';
import { User as CurrentUser } from '../auth/decorators/user.decorator';

@ApiTags('teams')
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Post()
  async create(@Body() dto: CreateTeamDto, @CurrentUser() user: User): Promise<{ message: string; data: Team }> {
    const team = await this.teamsService.create(dto, user);
    return { message: 'Equipo creado exitosamente', data: team };
  }

  @Get()
  async findAll(@Query() query: QueryTeamDto) {
    const result = await this.teamsService.findAll(query);
    if (!result.data.length) {
      throw new NotFoundException('No se encontraron equipos');
    }

    return {
      message: 'Equipos obtenidos correctamente',
      data: result.data,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
      },
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const team = await this.teamsService.findById(id);
    return {
      message: 'Equipo encontrado',
      data: team,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateTeamDto,
    @CurrentUser() user: User,
  ) {
    const team = await this.teamsService.updateTeam(id, dto, user);
    return {
      message: 'Equipo actualizado correctamente',
      data: team,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  async remove(@Param('id') id: number, @CurrentUser() user: User) {
    await this.teamsService.delete(id);
    return { message: 'Equipo eliminado correctamente' };
  }
}
