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
import { MatchStatsService } from './match_stat.service';
import { CreateMatchStatDto } from './dto/create-match_stat.dto';
import { UpdateMatchStatDto } from './dto/update-match_stat.dto';
import { QueryMatchStatDto } from './dto/query-match_stat.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('match_stats')
@Controller('match_stats')
export class MatchStatsController {
  constructor(private readonly service: MatchStatsService) {}

  @Post()
  async create(@Body() dto: CreateMatchStatDto) {
    const data = await this.service.create(dto);
    return {
      message: 'MatchStat creado exitosamente',
      data,
    };
  }

  @Get()
  async findAll(@Query() query: QueryMatchStatDto) {
    const result = await this.service.findAll(query);
    if (!result.data.length) {
      throw new NotFoundException('No se encontraron registros');
    }

    return {
      message: 'MatchStats obtenidos correctamente',
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
      message: 'MatchStat obtenido correctamente',
      data,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateMatchStatDto) {
    const data = await this.service.updateMatchStat(id, dto);
    return {
      message: 'MatchStat actualizado correctamente',
      data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.service.delete(id);
    return {
      message: 'MatchStat eliminado correctamente',
    };
  }
}
