import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { League } from './league.entity';

@Injectable()
export class LeaguesService {
  constructor(
    @InjectRepository(League)
    private readonly leagueRepository: Repository<League>,
  ) {}

  create(data: Partial<League>): Promise<League> {
    const league = this.leagueRepository.create(data);
    return this.leagueRepository.save(league);
  }

  findAll(): Promise<League[]> {
    return this.leagueRepository.find();
  }

  async findOne(id: number): Promise<League> {
    const league = await this.leagueRepository.findOneBy({ id });
    if (!league) {
      throw new Error(`League with id ${id} not found`);
    }
    return league;
  }
}
