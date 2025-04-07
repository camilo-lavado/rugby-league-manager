import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { League } from './league.entity';

@Injectable()
export class LeaguesService {
  logger = new Logger(LeaguesService.name);

  constructor(
    @InjectRepository(League)
    private readonly leagueRepository: Repository<League>,
  ) {}

  create(data: Partial<League>): Promise<League> {
    const league = this.leagueRepository.create(data);
    this.logger.log(`Creating league with name: ${data.name}`);
    return this.leagueRepository.save(league);
  }

  findAll(): Promise<League[]> {
    this.logger.log('Fetching all leagues');
    return this.leagueRepository.find();
  }

  delete(id: number): Promise<void> {
    this.logger.log(`Deleting league with id: ${id}`);
    return this.leagueRepository.delete(id).then(() => undefined);
  }

  update(id: number, data: Partial<League>): Promise<League> {
    this.logger.log(`Updating league with id: ${id}`);
    return this.leagueRepository.update(id, data).then(() => this.findOne(id));
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
