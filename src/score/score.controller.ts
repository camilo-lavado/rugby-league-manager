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
import { ScoresService } from './score.service';
import { CreateScoreDto } from './dto/create-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
import { QueryScoreDto } from './dto/query-score.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('scores')
@Controller('scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Post()
  async create(@Body() dto: CreateScoreDto) {
    const data = await this.scoresService.create(dto);
    return {
      message: 'Score creado exitosamente',
      data,
    };
  }

  @Get()
  async findAll(@Query() query: QueryScoreDto) {
    const result = await this.scoresService.findAll(query);
    if (!result.data.length) {
      throw new NotFoundException('No se encontraron registros');
    }

    return {
      message: 'Scores obtenidos correctamente',
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
    const data = await this.scoresService.findById(id);
    return {
      message: 'Score obtenido correctamente',
      data,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateScoreDto) {
    const data = await this.scoresService.updateScore(id, dto);
    return {
      message: 'Score actualizado correctamente',
      data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.scoresService.delete(id);
    return {
      message: 'Score eliminado correctamente',
    };
  }
}
