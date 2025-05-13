import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository, ILike, FindOptionsWhere } from 'typeorm';
import { Team } from './entities/team.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { QueryTeamDto } from './dto/query-team.dto';
import { User } from '../users/entities/user.entity';
import { PaginationService } from '../common/services/pagination.service';

@Injectable()
export class TeamsService {
  logger = new Logger(TeamsService.name);
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    private readonly paginationService: PaginationService,
  ) {}

  async create(dto: CreateTeamDto, user?: User): Promise<Team> {
    const team = this.teamRepository.create({
      ...dto,
      createdBy: user,
    });
    this.logger.log(`Creating team: ${team.name}`);
    const existingTeam = await this.teamRepository.findOneBy({ name: team.name });
    if (existingTeam) {
      throw new ConflictException(`Ya existe un equipo con el nombre ${team.name}`);
    }
    this.logger.log(`Team created: ${team.name}`);
    this.logger.log(`Team created by: ${user?.email}`);
    return this.teamRepository.save(team);
  }

  async findAll(query: QueryTeamDto) {
    const { page = 1, limit = 10, search, country, leagueId } = query;
    const where: FindOptionsWhere<Team>[] = [];
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
    if (leagueId) {
      if (where.length > 0) {
        where.forEach((condition, i) => {
          where[i] = { ...condition, leagueId: leagueId };
        });
      } else {
        where.push({ leagueId: leagueId, deletedAt: IsNull() });
      }
    }
    if (where.length === 0) {
      where.push({ deletedAt: IsNull() });
    }
    return this.paginationService.paginate(this.teamRepository, {
      page,
      limit,
      where,
      order: { name: 'ASC' },
    });
  }

  async findById(id: number): Promise<Team> {
    const team = await this.teamRepository.findOneBy({ id });
    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }
    return team;
  }


  async update(id: number, dto: UpdateTeamDto, user?: User): Promise<Team> {
    const team = await this.findById(id);
    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    } 
    this.logger.log(`Updating team: ${team.name}`);
    const existingTeam = await this.teamRepository.findOneBy({ name: dto.name });
    if (existingTeam && existingTeam.id !== id) {
      throw new ConflictException(`Ya existe un equipo con el nombre ${dto.name}`);
    }
    this.logger.log(`Team updated: ${team.name}`);
    this.logger.log(`Team updated by: ${user?.email}`);
    this.teamRepository.merge(team, dto);
    return this.teamRepository.save(team);
  }

  async delete(id: number, user?: User): Promise<void> {
    const team = await this.findById(id);
    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }
    this.logger.log(`Deleting team: ${team.name}`);
    team.deletedBy = user;
    team.deletedAt = new Date();
    await this.teamRepository.save(team);
    this.logger.log(`Team deleted: ${team.name}`);
    await this.teamRepository.softRemove(team);
    this.logger.log(`Team deleted by: ${user?.email}`);
}

}
