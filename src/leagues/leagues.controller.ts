import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { LeaguesService } from './leagues.service';
import { League } from './league.entity';

@Controller('leagues')
export class LeaguesController {
  constructor(private readonly leaguesService: LeaguesService) {}

  @Post()
  create(@Body() leagueData: Partial<League>): Promise<League> {
    return this.leaguesService.create(leagueData);
  }

  @Get()
  findAll(): Promise<League[]> {
    return this.leaguesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<League> {
    return this.leaguesService.findOne(id);
  }
}
