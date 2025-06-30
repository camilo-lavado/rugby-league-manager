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
import { MatchParticipationService } from './match_participation.service';
import { CreateMatchParticipationDto } from './dto/create-match_participation.dto';
import { UpdateMatchParticipationDto } from './dto/update-match_participation.dto';
import { QueryMatchParticipationDto } from './dto/query-match_paticipation.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('match_participation')
@Controller('match_participation')
export class MatchParticipationController {
  constructor(private readonly service: MatchParticipationService) {}

  @Post()
  async create(@Body() dto: CreateMatchParticipationDto) {
    const data = await this.service.create(dto);
    return {
      message: 'MatchParticipation creado exitosamente',
      data,
    };
  }

  @Get()
  async findAll(@Query() query: QueryMatchParticipationDto) {
    const result = await this.service.findAll(query);
    if (!result.data.length) {
      throw new NotFoundException('No se encontraron registros');
    }

    return {
      message: 'MatchParticipation obtenidos correctamente',
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
      message: 'MatchParticipation obtenido correctamente',
      data,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateMatchParticipationDto) {
    const data = await this.service.updateMatchParticipation(id, dto);
    return {
      message: 'MatchParticipation actualizado correctamente',
      data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.service.delete(id);
    return {
      message: 'MatchParticipation eliminado correctamente',
    };
  }
}
