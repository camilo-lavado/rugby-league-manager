import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { MatchTeamsService } from './match_team.service';
import { CreateMatchTeamDto } from './dto/create-match_team.dto';
import { UpdateMatchTeamDto } from './dto/update-match_team.dto';
import { QueryMatchTeamDto } from './dto/query-match_team.dto';
import { MatchTeam } from './entities/match_team.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('match_teams')
@Controller('match_teams')
export class MatchTeamsController {
  constructor(private readonly matchTeamsService: MatchTeamsService) {}

  @Post()
  async create(@Body() dto: CreateMatchTeamDto) {
    const result = await this.matchTeamsService.create(dto);
    return {
      message: 'MatchTeam creado exitosamente',
      data: result,
    };
  }

  @Get()
  async findAll(@Query() query: QueryMatchTeamDto) {
    const result = await this.matchTeamsService.findAll(query);
    if (!result.data.length) {
      throw new NotFoundException('No se encontraron registros');
    }

    return {
      message: 'MatchTeams obtenidos correctamente',
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
    const result = await this.matchTeamsService.findById(id);
    return {
      message: 'MatchTeam obtenido correctamente',
      data: result,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateMatchTeamDto) {
    const result = await this.matchTeamsService.updateMatchTeam(id, dto);
    return {
      message: 'MatchTeam actualizado correctamente',
      data: result,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.matchTeamsService.delete(id);
    return {
      message: 'MatchTeam eliminado correctamente',
    };
  }
}
