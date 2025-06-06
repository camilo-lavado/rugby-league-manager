import {
  Controller,
  Param,
  Body,
  Patch,
  Delete,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiParam, ApiBadRequestResponse, ApiNotFoundResponse, ApiResponse } from '@nestjs/swagger';
import { League } from './league.entity';
import { CreateLeagueDto } from './dto/create-league.dto';
import { UpdateLeagueDto } from './dto/update-league.dto';
import { QueryLeagueDto } from './dto/query-league.dto';
import { LeaguesService } from './leagues.service';
import { BaseCrudController } from '../common/controllers/base-crud.controller';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { User } from '../users/entities/user.entity';
import { User as CurrentUser } from '../auth/decorators/user.decorator';

@ApiTags('leagues')
@Controller('leagues')
export class LeaguesController extends BaseCrudController<
  League,
  CreateLeagueDto,
  UpdateLeagueDto,
  QueryLeagueDto
> {
  constructor(private readonly leaguesService: LeaguesService) {
    super(leaguesService);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'League updated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiNotFoundResponse({ description: 'League not found' })
  @ApiParam({ name: 'id', description: 'League ID', type: Number })
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateLeagueDto,
    @CurrentUser() user: User,
  ): Promise<{ message: string; data: League }> {
    const updated = await this.leaguesService.updateWithUser(id, dto, user);
    if (!updated) {
      throw new NotFoundException(`League with ID ${id} not found`);
    }
    return {
      message: 'Liga actualizada exitosamente',
      data: updated,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'League deleted successfully' })
  @ApiNotFoundResponse({ description: 'League not found' })
  @ApiParam({ name: 'id', description: 'League ID', type: Number })
  async delete(
    @Param('id') id: number,
    @CurrentUser() user: User,
  ): Promise<{ message: string }> {
    await this.leaguesService.deleteWithUser(id, user);
    return {
      message: 'Liga eliminada exitosamente',
    };
  }
}
