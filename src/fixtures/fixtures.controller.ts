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
import { FixturesService } from './fixtures.service';
import { CreateFixtureDto } from './dto/create-fixture.dto';
import { UpdateFixtureDto } from './dto/update-fixture.dto';
import { QueryFixtureDto } from './dto/query-fixture.dto';
import { Fixture } from './entities/fixture.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { User as CurrentUser } from '../auth/decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('fixtures')
@Controller('fixtures')
export class FixturesController {
  constructor(private readonly fixturesService: FixturesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Post()
  async create(@Body() dto: CreateFixtureDto, @CurrentUser() user: User): Promise<{ message: string; data: Fixture }> {
    const fixture = await this.fixturesService.create(dto, user);
    return {
      message: 'Fixture creado exitosamente',
      data: fixture,
    };
  }

  @Get()
  async findAll(@Query() query: QueryFixtureDto) {
    const result = await this.fixturesService.findAll(query);
    if (!result.data.length) {
      throw new NotFoundException('No se encontraron fixtures');
    }

    return {
      message: 'Fixtures obtenidos correctamente',
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
    const fixture = await this.fixturesService.findById(id);
    return {
      message: 'Fixture obtenido correctamente',
      data: fixture,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateFixtureDto,
    @CurrentUser() user: User,
  ) {
    const fixture = await this.fixturesService.updateFixture(id, dto, user);
    return {
      message: 'Fixture actualizado correctamente',
      data: fixture,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  async remove(@Param('id') id: number, @CurrentUser() user: User) {
    await this.fixturesService.delete(id);
    return { message: 'Fixture eliminado correctamente' };
  }
}
