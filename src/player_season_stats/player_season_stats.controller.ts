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
import { PlayerSeasonStatsService } from './player_season_stats.service';
import { CreatePlayerSeasonStatDto } from './dto/create-player_season_stat.dto';
import { UpdatePlayerSeasonStatDto } from './dto/update-player_season_stat.dto';
import { QueryPlayerSeasonStatDto } from './dto/query-player_season_stat.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('player_season_stats')
@Controller('player_season_stats')
export class PlayerSeasonStatsController {
  constructor(private readonly service: PlayerSeasonStatsService) {}

  @Post()
  async create(@Body() dto: CreatePlayerSeasonStatDto) {
    const data = await this.service.create(dto);
    return {
      message: 'PlayerSeasonStat creado exitosamente',
      data,
    };
  }

  @Get()
  async findAll(@Query() query: QueryPlayerSeasonStatDto) {
    const result = await this.service.findAll(query);
    if (!result.data.length) {
      throw new NotFoundException('No se encontraron registros');
    }

    return {
      message: 'PlayerSeasonStats obtenidos correctamente',
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
    const data = await this.service.findById(id);
    return {
      message: 'PlayerSeasonStat obtenido correctamente',
      data,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: UpdatePlayerSeasonStatDto) {
    const data = await this.service.updatePlayerSeasonStat(id, dto);
    return {
      message: 'PlayerSeasonStat actualizado correctamente',
      data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.service.delete(id);
    return {
      message: 'PlayerSeasonStat eliminado correctamente',
    };
  }
}
