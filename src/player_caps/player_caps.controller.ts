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
import { PlayerCapsService } from './player_caps.service';
import { CreatePlayerCapDto } from './dto/create-player_cap.dto';
import { UpdatePlayerCapDto } from './dto/update-player_cap.dto';
import { QueryPlayerCapDto } from './dto/query-player_cap.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('player_caps')
@Controller('player_caps')
export class PlayerCapsController {
  constructor(private readonly service: PlayerCapsService) {}

  @Post()
  async create(@Body() dto: CreatePlayerCapDto) {
    const data = await this.service.create(dto);
    return {
      message: 'PlayerCap creado exitosamente',
      data,
    };
  }

  @Get()
  async findAll(@Query() query: QueryPlayerCapDto) {
    const result = await this.service.findAll(query);
    if (!result.data.length) {
      throw new NotFoundException('No se encontraron registros');
    }

    return {
      message: 'PlayerCaps obtenidos correctamente',
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
      message: 'PlayerCap obtenido correctamente',
      data,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: UpdatePlayerCapDto) {
    const data = await this.service.updatePlayerCap(id, dto);
    return {
      message: 'PlayerCap actualizado correctamente',
      data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.service.delete(id);
    return {
      message: 'PlayerCap eliminado correctamente',
    };
  }
}
