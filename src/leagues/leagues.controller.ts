import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { LeaguesService } from './leagues.service';
import { League } from './league.entity';

@Controller('leagues')
export class LeaguesController {
  constructor(private readonly leaguesService: LeaguesService) {}

  @Post()
  async create(@Body() data: Partial<League>): Promise<{ message: string; data: League }> {
    const league = await this.leaguesService.create(data);
    return {
      message: 'Liga creada exitosamente',
      data: league,
    };
  }

  @Get()
  async findAll(): Promise<{ message: string; data: League[] }> {
    const leagues = await this.leaguesService.findAll();
    return {
      message: 'Ligas obtenidas exitosamente',
      data: leagues,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<{ message: string; data: League }> {
    const league = await this.leaguesService.findOne(id);
    return {
      message: 'Liga obtenida exitosamente',
      data: league,
    };
  }

  @Post(':id')
  async update(
    @Param('id') id: number,
    @Body() data: Partial<League>,
  ): Promise<{ message: string; data: League }> {
    const league = await this.leaguesService.update(id, data);
    return {
      message: 'Liga actualizada exitosamente',
      data: league,
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<{ message: string }> {
    await this.leaguesService.delete(id);
    return {
      message: 'Liga eliminada exitosamente',
    };
  }
}
