import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { PositionsService } from './positions.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { Position } from './entities/position.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User as CurrentUser } from '../auth/decorators/user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('positions')
@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Post()
  async create(@Body() dto: CreatePositionDto, @CurrentUser() user: User): Promise<{ message: string; data: Position }> {
    const position = await this.positionsService.create(dto, user);
    return {
      message: 'Posición creada exitosamente',
      data: position,
    };
  }

  @Get()
  async findAll(@Query() query: any) {
    const result = await this.positionsService.findAll(query);
    if (!result.data.length) {
      throw new NotFoundException('No se encontraron posiciones');
    }

    return {
      message: 'Posiciones obtenidas correctamente',
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
    const position = await this.positionsService.findById(id);
    return {
      message: 'Posición obtenida exitosamente',
      data: position,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  async update(
    @Param('id') id: number,
    @Body() dto: UpdatePositionDto,
    @CurrentUser() user: User,
  ) {
    const position = await this.positionsService.updatePosition(id, dto, user);
    return {
      message: 'Posición actualizada correctamente',
      data: position,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  async remove(@Param('id') id: number, @CurrentUser() user: User) {
    await this.positionsService.delete(id);
    return {
      message: 'Posición eliminada correctamente',
    };
  }
}
