import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository, ILike, FindOptionsWhere } from 'typeorm';
import { League } from './league.entity';
import { CreateLeagueDto } from './dto/create-league.dto';
import { UpdateLeagueDto } from './dto/update-league.dto';
import { QueryLeagueDto } from './dto/query-league.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class LeaguesService {
  logger = new Logger(LeaguesService.name);

  constructor(
    @InjectRepository(League)
    private readonly leagueRepository: Repository<League>,
  ) {}

  async create(dto: CreateLeagueDto, user?: User): Promise<League> {
  const league = this.leagueRepository.create({
    ...dto,
    createdBy: user,
  });
  this.logger.log(`Creating league: ${league.name}`);
  const existingLeague = await this.leagueRepository.findOneBy({ name: league.name });
  if (existingLeague) {
   throw new ConflictException(`Ya existe una liga con el nombre ${league.name}`);
  }
  this.logger.log(`League created: ${league.name}`);
  this.logger.log(`League created by: ${user?.email}`);
  return this.leagueRepository.save(league);
}

async findAll(query: QueryLeagueDto): Promise<{
  data: League[];
  total: number;
  page: number;
  limit: number;
}> {
  const { page = 1, limit = 10, search, country } = query;

  const where: FindOptionsWhere<League>[] = [];

  if (search) {
    where.push({ name: ILike(`%${search}%`), deletedAt: IsNull() });
  }

  if (country) {
    if (where.length > 0) {
      where.forEach((condition, i) => {
        where[i] = { ...condition, country: ILike(`%${country}%`) };
      });
    } else {
      where.push({ country: ILike(`%${country}%`), deletedAt: IsNull() });
    }
  }

  if (where.length === 0) {
    where.push({ deletedAt: IsNull() });
  }

  this.logger.log(
    `Fetching page ${page} with limit ${limit} | search: ${search || 'none'} | country: ${country || 'any'}`
  );

  const [data, total] = await this.leagueRepository.findAndCount({
    where,
    take: limit,
    skip: (page - 1) * limit,
    order: { name: 'ASC' },
  });

  return {
    data,
    total,
    page,
    limit,
  };
}



  async delete(id: number): Promise<void> {
  const league = await this.findById(id);
  if (!league) throw new NotFoundException(`League ${id} not found`);
  await this.leagueRepository.softRemove(league);
  this.logger.log(`League deleted: ${league.name}`);
  this.logger.log(`League deleted by: ${league.deletedBy?.email}`);
  }

  async restore(id: number): Promise<void> {
    const league = await this.leagueRepository.findOne({ where: { id }, withDeleted: true });
    if (!league) throw new NotFoundException(`League ${id} not found`);
    await this.leagueRepository.restore(id);
    this.logger.log(`League restored: ${league.name}`);
    this.logger.log(`League restored by: ${league.deletedBy?.email}`);
  }

  async findDeleted(): Promise<League[]> {
    this.logger.log('Fetching all deleted leagues');
    return await this.leagueRepository.find({ withDeleted: true });
  }

  async findDeletedById(id: number): Promise<League | null> {
    const league = await this.leagueRepository.findOne({ where: { id }, withDeleted: true });
    if (!league) {
      this.logger.warn(`League with id ${id} not found`);
      return null;
    }
    this.logger.log(`League found: ${league.name}`);
    return league;
  }

  async findDeletedByName(name: string): Promise<League | null> {
    const league = await this.leagueRepository.findOne({ where: { name }, withDeleted: true });
    if (!league) {
      this.logger.warn(`League with name ${name} not found`);
      return null;
    }
    this.logger.log(`League found: ${league.name}`);
    return league;
  }

  async update(id: number, dto: UpdateLeagueDto): Promise<League | null> {
    const league = await this.findById(id);
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


}
