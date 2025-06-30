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
import { MatchAggregatesService } from './match_aggregates.service';
import { CreateMatchAggregateDto } from './dto/create-match_aggregate.dto';
import { UpdateMatchAggregateDto } from './dto/update-match_aggregate.dto';
import { QueryMatchAggregateDto } from './dto/query-match_aggregate.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('match_aggregates')
@Controller('match_aggregates')
export class MatchAggregatesController {
  constructor(private readonly service: MatchAggregatesService) {}

  @Post()
  async create(@Body() dto: CreateMatchAggregateDto) {
    const data = await this.service.create(dto);
    return {
      message: 'MatchAggregate creado exitosamente',
      data,
    };
  }

  @Get()
  async findAll(@Query() query: QueryMatchAggregateDto) {
    const result = await this.service.findAll(query);
    if (!result.data.length) {
      throw new NotFoundException('No se encontraron registros');
    }

    return {
      message: 'MatchAggregates obtenidos correctamente',
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
      message: 'MatchAggregate obtenido correctamente',
      data,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateMatchAggregateDto) {
    const data = await this.service.updateMatchAggregate(id, dto);
    return {
      message: 'MatchAggregate actualizado correctamente',
      data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.service.delete(id);
    return {
      message: 'MatchAggregate eliminado correctamente',
    };
  }
}
