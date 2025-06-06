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
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { QueryPlayerDto } from './dto/query-player.dto';
import { Player } from './entities/player.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { User } from '../users/entities/user.entity';
import { User as CurrentUser } from '../auth/decorators/user.decorator';

@ApiTags('players')
@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Post()
  async create(
    @Body() dto: CreatePlayerDto,
    @CurrentUser() user: User,
  ): Promise<{ message: string; data: Player }> {
    const player = await this.playersService.create(dto, user);
    return {
      message: 'Jugador creado exitosamente',
      data: player,
    };
  }

  @Get()
  async findAll(@Query() query: QueryPlayerDto) {
    const result = await this.playersService.findAll(query);
    if (!result.data.length) {
      throw new NotFoundException('No se encontraron jugadores');
    }

    return {
      message: 'Jugadores obtenidos correctamente',
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
    const player = await this.playersService.findById(id);
    return {
      message: 'Jugador encontrado',
      data: player,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  async update(
    @Param('id') id: number,
    @Body() dto: UpdatePlayerDto,
    @CurrentUser() user: User,
  ) {
    const player = await this.playersService.updatePlayer(id, dto, user);
    return {
      message: 'Jugador actualizado correctamente',
      data: player,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  async remove(@Param('id') id: number, @CurrentUser() user: User) {
    await this.playersService.delete(id);
    if (!id) {
      throw new NotFoundException(`No se encontró el jugador con ID ${id}`);
    }
    return {
      message: 'Jugador eliminado correctamente',
    };
  }
}
