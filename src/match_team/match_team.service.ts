import { Injectable, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchTeam } from './entities/match_team.entity';
import { PaginationService } from '../common/services/pagination.service';
import { BaseCrudService } from '../common/services/base-crud.service';
import { CreateMatchTeamDto } from './dto/create-match_team.dto';
import { UpdateMatchTeamDto } from './dto/update-match_team.dto';

@Injectable()
export class MatchTeamsService extends BaseCrudService<MatchTeam> {
  protected readonly logger = new Logger(MatchTeamsService.name);

  constructor(
    @InjectRepository(MatchTeam)
    private readonly matchTeamRepository: Repository<MatchTeam>,
    paginationService: PaginationService,
  ) {
    super(matchTeamRepository, paginationService);
  }

  async create(dto: CreateMatchTeamDto): Promise<MatchTeam> {
    const exists = await this.matchTeamRepository.findOneBy({
      fixtureId: dto.fixtureId,
      teamId: dto.teamId,
    });

    if (exists) {
      throw new ConflictException('Ya existe un registro con estos datos');
    }

    const nuevo = this.matchTeamRepository.create(dto);
    return this.matchTeamRepository.save(nuevo);
  }

  async updateMatchTeam(id: number, dto: UpdateMatchTeamDto): Promise<MatchTeam> {
    const existing = await this.matchTeamRepository.findOneBy({ id });
    if (!existing) {
      throw new NotFoundException(`No se encontró el registro con ID ${id}`);
    }

    const merged = this.matchTeamRepository.merge(existing, dto);
    return this.matchTeamRepository.save(merged);
  }
}
