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
import { SeasonsService } from './seasons.service';
import { CreateSeasonDto } from './dto/create-season.dto';
import { UpdateSeasonDto } from './dto/update-season.dto';
import { QuerySeasonDto } from './dto/query-season.dto';
import { Season } from './entities/season.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('seasons')
@Controller('seasons')
export class SeasonsController {
  constructor(private readonly seasonsService: SeasonsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Post()
  async create(
    @Body() dto: CreateSeasonDto,
  ): Promise<{ message: string; data: Season }> {
    const season = await this.seasonsService.create(dto);
    return {
      message: 'Temporada creada exitosamente',
      data: season,
    };
  }

  @Get()
  async findAll(@Query() query: QuerySeasonDto) {
    const result = await this.seasonsService.findAll(query);
    if (!result.data.length) {
      throw new NotFoundException('No se encontraron temporadas');
    }

    return {
      message: 'Temporadas obtenidas correctamente',
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
    const season = await this.seasonsService.findById(id);
    if (!season) {
      throw new NotFoundException(`Temporada con ID ${id} no encontrada`);
    }

    return {
      message: 'Temporada obtenida correctamente',
      data: season,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateSeasonDto,
  ) {
    const season = await this.seasonsService.updateSeason(id, dto);
    return {
      message: 'Temporada actualizada correctamente',
      data: season,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  async remove(@Param('id') id: number) {
    await this.seasonsService.delete(id);
    return {
      message: 'Temporada eliminada correctamente',
    };
  }
}
