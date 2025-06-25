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
import { StadiumsService } from './stadiums.service';
import { CreateStadiumDto } from './dto/create-stadium.dto';
import { UpdateStadiumDto } from './dto/update-stadium.dto';
import { Stadium } from './entities/stadium.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { User } from '../users/entities/user.entity';
import { User as CurrentUser } from '../auth/decorators/user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QueryStadiumDto } from './dto/query-stadium.dto';

@ApiTags('stadiums')
@Controller('stadiums')
export class StadiumsController {
  constructor(private readonly stadiumsService: StadiumsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Post()
  async create(
    @Body() dto: CreateStadiumDto,
    @CurrentUser() user: User,
  ): Promise<{ message: string; data: Stadium }> {
    const stadium = await this.stadiumsService.create(dto, user);
    return {
      message: 'Estadio creado exitosamente',
      data: stadium,
    };
  }

  @Get()
  async findAll(
    @Query() query: QueryStadiumDto,
  ): Promise<{
    message: string;
    data: Stadium[];
    meta: { total: number; page: number; limit: number };
  }> {
    const result = await this.stadiumsService.findAll(query);
    if (!result.data.length) {
      throw new NotFoundException('No se encontraron estadios');
    }

    return {
      message: 'Estadios obtenidos correctamente',
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
    const stadium = await this.stadiumsService.findById(id);
    if (!stadium) {
      throw new NotFoundException(`Estadio con ID ${id} no encontrado`);
    }

    return {
      message: 'Estadio obtenido correctamente',
      data: stadium,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateStadiumDto,
    @CurrentUser() user: User,
  ) {
    const stadium = await this.stadiumsService.updateStadium(id, dto, user);
    return {
      message: 'Estadio actualizado correctamente',
      data: stadium,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  async remove(@Param('id') id: number, @CurrentUser() user: User) {
    await this.stadiumsService.delete(id);
    return {
      message: 'Estadio eliminado correctamente',
    };
  }
}
