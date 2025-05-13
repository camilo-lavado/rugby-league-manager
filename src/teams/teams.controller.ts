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
import { TeamsService } from './teams.service';
import { Team } from '../teams/entities/team.entity';
import {
  ApiTags,
  ApiResponse,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { QueryTeamDto } from './dto/query-team.dto';
import { User } from '../users/entities/user.entity';
import { User as CurrentUser } from '../auth/decorators/user.decorator';
import * as request from 'supertest';


@ApiTags('teams')
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Team created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @Post()
  async create(
    @Body() createTeamDto: CreateTeamDto,
    @CurrentUser() user: User,):
    Promise<{ message: string; data: Team }> {
    const team = await this.teamsService.create(createTeamDto, user);
    return {
      message: 'Team created successfully',
      data: team,
    };
  }

  @Get()
  @ApiResponse({ status: 200, description: 'List of teams retrieved successfully' })
  async findAll(
    @Query() query: QueryTeamDto,
  ): Promise<{
    message: string;
    data: Team[];
    meta: {
      total: number;
      page: number;
      limit: number;
    };
  }> {
    const result = await this.teamsService.findAll(query);
    if (!result.data || result.data.length === 0) {
      throw new NotFoundException('No teams found');
    }
    return {
      message: 'Teams retrieved successfully',
      data: result.data,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
      },
    };
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Team retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Team not found' })
  @ApiParam({ name: 'id', description: 'Team ID' })
  async findOne(@Param('id') id: number): Promise<{ message: string; data: Team }> {
    const team = await this.teamsService.findById(id);
    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }
    return {
      message: 'Team retrieved successfully',
      data: team,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Team updated successfully' })
  @ApiNotFoundResponse({ description: 'Team not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiParam({ name: 'id', description: 'Team ID', type: Number })
  async update(
    @Param('id') id: number,
    @Body() updateTeamDto: UpdateTeamDto,
    @CurrentUser() user: User,
  ): Promise<{ message: string; data: Team }> {
    const team = await this.teamsService.update(id, updateTeamDto, user);
    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }
    return {
      message: 'Team updated successfully',
      data: team,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Team deleted successfully' })
  @ApiNotFoundResponse({ description: 'Team not found' })
  @ApiParam({ name: 'id', description: 'Team ID', type: Number })
  async remove(
    @Param('id') id: number,
    @CurrentUser() user: User,
  ): Promise<{ message: string }> {
    await this.teamsService.delete(id, user);
    return {
      message: 'Team deleted successfully',
    };
  }



}
