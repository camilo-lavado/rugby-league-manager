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
import { PlayersService } from './players.service';
import { Player } from './entities/player.entity';
import {
  ApiTags,
  ApiResponse,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { QueryPlayerDto } from './dto/query-player.dto';
import { User } from '../users/entities/user.entity';
import { User as CurrentUser } from '../auth/decorators/user.decorator';



@ApiTags('players')
@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Player created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @Post()
  async create(
    @Body() createPlayerDto: CreatePlayerDto,
    @CurrentUser() user: User,): 
    Promise<{ message: string; data: Player }> {
    const player = await this.playersService.create(createPlayerDto, user);
    return {
      message: 'Player created successfully',
      data: player,
    };
  }
  

  @Get()
   @ApiResponse({ status: 200, description: 'List of players retrieved successfully' })
   async findAll(
     @Query() query: QueryPlayerDto,
   ): Promise<{
     message: string;
     data: Player[];
     meta: {
       total: number;
       page: number;
       limit: number;
     };
   }> {
     const result = await this.playersService.findAll(query);
     if (!result.data || result.data.length === 0) {
       throw new NotFoundException('No players found');
     }
     return {
       message: 'Players retrieved successfully',
       data: result.data,
       meta: {
         total: result.total,
         page: result.page,
         limit: result.limit,
       },
     };
   }

  @Get(':id')
    @ApiResponse({ status: 200, description: 'Player retrieved successfully' })
    @ApiNotFoundResponse({ description: 'Player not found' })
    @ApiParam({ name: 'id', description: 'Player ID' })
    async findOne(@Param('id') id: number): Promise<{ message: string; data: Player }> {
      const player = await this.playersService.findById(id);
      if (!player) {
        throw new NotFoundException(`Player with ID ${id} not found`);
      }
      return {
        message: 'Player retrieved successfully',
        data: player,
      };
    }

  @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Player updated successfully' })
    @ApiNotFoundResponse({ description: 'Player not found' })
    @ApiBadRequestResponse({ description: 'Invalid input data' })
    @ApiParam({ name: 'id', description: 'Player ID', type: Number })
    async update(
      @Param('id') id: number,
      @Body() updatePlayerDto: UpdatePlayerDto,
      @CurrentUser() user: User,
    ): Promise<{ message: string; data: Player }> {
      const player = await this.playersService.update(id, updatePlayerDto, user);
      if (!player) {
        throw new NotFoundException(`Player with ID ${id} not found`);
      }
      return {
        message: 'Player updated successfully',
        data: player,
      };
    }
  
    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Player deleted successfully' })
    @ApiNotFoundResponse({ description: 'Player not found' })
    @ApiParam({ name: 'id', description: 'Player ID', type: Number })
    async remove(
      @Param('id') id: number,
      @CurrentUser() user: User,
    ): Promise<{ message: string }> {
      await this.playersService.delete(id, user);
      return {
        message: 'Player deleted successfully',
      };
    }
}


