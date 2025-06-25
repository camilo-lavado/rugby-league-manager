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
import { DivisionsService } from './divisions.service';
import { CreateDivisionDto } from './dto/create-division.dto';
import { UpdateDivisionDto } from './dto/update-division.dto';
import { QueryDivisionDto } from './dto/query-division.dto';
import { Division } from './entities/division.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { User } from '../users/entities/user.entity';
import { User as CurrentUser } from '../auth/decorators/user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('divisions')
@Controller('divisions')
export class DivisionsController {
  constructor(private readonly divisionsService: DivisionsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Post()
  async create(
    @Body() dto: CreateDivisionDto,
    @CurrentUser() user: User,
  ): Promise<{ message: string; data: Division }> {
    const division = await this.divisionsService.create(dto, user);
    return {
      message: 'División creada exitosamente',
      data: division,
    };
  }

  @Get()
  async findAll(@Query() query: QueryDivisionDto) {
    const result = await this.divisionsService.findAll(query);
    if (!result.data.length) {
      throw new NotFoundException('No se encontraron divisiones');
    }

    return {
      message: 'Divisiones obtenidas correctamente',
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
    const division = await this.divisionsService.findById(id);
    if (!division) {
      throw new NotFoundException(`División con ID ${id} no encontrada`);
    }

    return {
      message: 'División obtenida correctamente',
      data: division,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateDivisionDto,
    @CurrentUser() user: User,
  ) {
    const division = await this.divisionsService.updateDivision(id, dto, user);
    return {
      message: 'División actualizada correctamente',
      data: division,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  async remove(@Param('id') id: number, @CurrentUser() user: User) {
    await this.divisionsService.delete(id);
    return {
      message: 'División eliminada correctamente',
    };
  }
}
