import { Controller, Post, Body, Get, Param, Delete, Put, NotFoundException } from '@nestjs/common';
import { LeaguesService } from './leagues.service';
import { League } from './league.entity';
import {
  ApiTags,
  ApiResponse,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { CreateLeagueDto } from './dto/create-league.dto';
import { UpdateLeagueDto } from './dto/update-league.dto';

@ApiTags('leagues')
@Controller('leagues')
export class LeaguesController {
  constructor(private readonly leaguesService: LeaguesService) {}

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
  async findAll(): Promise<{ message: string; data: League[] }> {
    const leagues = await this.leaguesService.findAll();
    return {
      message: 'Ligas obtenidas exitosamente',
      data: leagues,
    };
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'League retrieved successfully' })
  @ApiNotFoundResponse({ description: 'League not found' })
  @ApiParam({ name: 'id', description: 'League ID', type: Number })
  async findOne(@Param('id') id: number): Promise<{ message: string; data: League }> {
    const league = await this.leaguesService.findOne(id);
    return {
      message: 'Liga obtenida exitosamente',
      data: league,
    };
  }

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
