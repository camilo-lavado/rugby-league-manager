import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { League } from './league.entity';
import { CreateLeagueDto } from './dto/create-league.dto';
import { UpdateLeagueDto } from './dto/update-league.dto';

@Injectable()
export class LeaguesService {
  logger = new Logger(LeaguesService.name);

  constructor(
    @InjectRepository(League)
    private readonly leagueRepository: Repository<League>,
  ) {}

  async create(data: CreateLeagueDto): Promise<League> {
    const league = this.leagueRepository.create(data);
    this.logger.log(`Creating league: ${JSON.stringify(data)}`);
    return await this.leagueRepository.save(league);
  }

  async findAll(): Promise<League[]> {
    this.logger.log('Fetching all leagues');
    return await this.leagueRepository.find();
  }

  async delete(id: number): Promise<void> {
    this.logger.log(`Deleting league with id: ${id}`);
    await this.leagueRepository.delete(id);
    const league = await this.leagueRepository.findOneBy({ id });
    if (league) {
      this.logger.warn(`League with id ${id} was not deleted`);
      throw new Error(`League with id ${id} was not deleted`);
    }
    this.logger.log(`League with id ${id} deleted successfully`);
  }

  async update(id: number, dto: UpdateLeagueDto): Promise<League | null> {
    const league = await this.findOne(id);
    if (!league) return null;

    const updated = this.leagueRepository.merge(league, dto);
    return this.leagueRepository.save(updated);
  }

  async findByName(name: string): Promise<League | null> {
    const league = await this.leagueRepository.findOneBy({ name });
    if (!league) {
      this.logger.warn(`League with name ${name} not found`);
      return null;
    }
    this.logger.log(`League found: ${league.name}`);
    return league;
  }
  async findById(id: number): Promise<League | null> {
    const league = await this.leagueRepository.findOneBy({ id });
    if (!league) {
      this.logger.warn(`League with id ${id} not found`);
      return null;
    }
    this.logger.log(`League found: ${league.name}`);
    return league;
  }

  async findOne(id: number): Promise<League> {
    const league = await this.leagueRepository.findOneBy({ id });
    if (!league) {
      throw new Error(`League with id ${id} not found`);
    }
    this.logger.log(`League found: ${league.name}`);
    return league;
  }
}
