import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { StandingsService } from './standings.service';
import { CreateStandingDto } from './dto/create-standing.dto';
import { UpdateStandingDto } from './dto/update-standing.dto';
import { QueryStandingDto } from './dto/query-standing.dto';
import { Standing } from './entities/standing.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('standings')
@Controller('standings')
export class StandingsController {
  constructor(private readonly standingsService: StandingsService) {}

  @Post()
  async create(@Body() dto: CreateStandingDto): Promise<{ message: string; data: Standing }> {
    const standing = await this.standingsService.create(dto);
    return {
      message: 'Standing creado exitosamente',
      data: standing,
    };
  }

  @Get()
  async findAll(@Query() query: QueryStandingDto) {
    const result = await this.standingsService.findAll(query);

    if (!result.data.length) {
      throw new NotFoundException('No se encontraron standings');
    }

    return {
      message: 'Standings obtenidos correctamente',
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
    const standing = await this.standingsService.findById(id);
    if (!standing) {
      throw new NotFoundException(`Standing con ID ${id} no encontrado`);
    }

    return {
      message: 'Standing encontrado',
      data: standing,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateStandingDto) {
    const standing = await this.standingsService.updateStanding(id, dto);
    return {
      message: 'Standing actualizado correctamente',
      data: standing,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.standingsService.delete(id);
    return {
      message: 'Standing eliminado correctamente',
    };
  }
}
