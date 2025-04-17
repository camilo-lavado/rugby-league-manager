import { Controller, Post, Body, Get, Param, Delete, Put, NotFoundException, UseGuards, Query } from '@nestjs/common';
import { LeaguesService } from './leagues.service';
import { League } from './league.entity';
import {
  ApiTags,
  ApiResponse,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateLeagueDto } from './dto/create-league.dto';
import { UpdateLeagueDto } from './dto/update-league.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { QueryLeagueDto } from './dto/query-league.dto';

@ApiTags('leagues')
@Controller('leagues')
export class LeaguesController {
  constructor(private readonly leaguesService: LeaguesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard) //Ejemplo de como usar los guards y los roles
  @Roles('admin')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'User authenticated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid credentials' })
  @Post()
  @ApiCreatedResponse({ description: 'League created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async create(
    @Body() createLeagueDto: CreateLeagueDto,
  ): Promise<{ message: string; data: League }> {
    const league = await this.leaguesService.create(createLeagueDto);
    return {
      message: 'Liga creada exitosamente',
      data: league,
    };
  }

  @Get()
@ApiResponse({ status: 200, description: 'List of leagues retrieved successfully' })
async findAll(
  @Query() query: QueryLeagueDto,
): Promise<{
  message: string;
  data: League[];
  meta: { total: number; page: number; limit: number };
}> {
  const result = await this.leaguesService.findAll(query);

  if (!result.data || result.data.length === 0) {
    throw new NotFoundException('No leagues found');
  }

  return {
    message: 'Ligas obtenidas exitosamente',
    data: result.data,
    meta: {
      total: result.total,
      page: result.page,
      limit: result.limit,
    },
  };
}

  @Get(':id')
  @ApiResponse({ status: 200, description: 'League retrieved successfully' })
  @ApiNotFoundResponse({ description: 'League not found' })
  @ApiParam({ name: 'id', description: 'League ID', type: Number })
  async findOne(@Param('id') id: number): Promise<{ message: string; data: League }> {
      const league = await this.leaguesService.findById(id);
      if (!league) {
        throw new NotFoundException(`League with ID ${id} not found`);
      }
      return {
        message: 'Liga obtenida exitosamente',
        data: league,
      };
    }

  @UseGuards(JwtAuthGuard, RolesGuard) //Ejemplo de como usar los guards y los roles
  @Roles('admin')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'User authenticated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid credentials' })
  @Put(':id')
  @ApiResponse({ status: 200, description: 'League updated successfully' })
  @ApiNotFoundResponse({ description: 'League not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiParam({ name: 'id', description: 'League ID', type: Number })
  async update(@Param('id') id: number, @Body() dto: UpdateLeagueDto): Promise<League> {
    const updated = await this.leaguesService.update(id, dto);
    if (!updated) {
      throw new NotFoundException(`League with ID ${id} not found`);
    }
    return updated;
  }

  @UseGuards(JwtAuthGuard, RolesGuard) //Ejemplo de como usar los guards y los roles
  @Roles('admin')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'User authenticated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid credentials' })
  @Delete(':id')
  @ApiResponse({ status: 200, description: 'League deleted successfully' })
  @ApiNotFoundResponse({ description: 'League not found' })
  @ApiParam({ name: 'id', description: 'League ID', type: Number })
  async delete(@Param('id') id: number): Promise<{ message: string }> {
    await this.leaguesService.delete(id);
    return {
      message: 'Liga eliminada exitosamente',
    };
  }
}
