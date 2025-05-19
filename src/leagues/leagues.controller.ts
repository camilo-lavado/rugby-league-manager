import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
  NotFoundException,
  UseGuards,
  Query,
  Patch,
} from '@nestjs/common';
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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { QueryLeagueDto } from './dto/query-league.dto';
import { User } from '../users/entities/user.entity';
import { User as CurrentUser } from '../auth/decorators/user.decorator';

@ApiTags('leagues')
@Controller('leagues')
export class LeaguesController {
  constructor(private readonly leaguesService: LeaguesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'League created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @Post()
  async create(
    @Body() createLeagueDto: CreateLeagueDto,
    @CurrentUser() user: User,
  ): Promise<{ message: string; data: League }> {
    const league = await this.leaguesService.create(createLeagueDto, user);
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'League updated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @Patch(':id')
  @ApiParam({ name: 'id', description: 'League ID', type: Number })
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateLeagueDto,
    @CurrentUser() user: User,
  ): Promise<League> {
    const updated = await this.leaguesService.update(id, dto, user);
    if (!updated) {
      throw new NotFoundException(`League with ID ${id} not found`);
    }
    return updated;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'League deleted successfully' })
  @ApiNotFoundResponse({ description: 'League not found' })
  @Delete(':id')
  @ApiParam({ name: 'id', description: 'League ID', type: Number })
  async delete(
    @Param('id') id: number,
    @CurrentUser() user: User,
  ): Promise<{ message: string }> {
    await this.leaguesService.delete(id, user);
    return {
      message: 'Liga eliminada exitosamente',
    };
  }
}
