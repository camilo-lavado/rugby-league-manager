import { Injectable, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchStat } from './entities/match_stat.entity';
import { PaginationService } from '../common/services/pagination.service';
import { BaseCrudService } from '../common/services/base-crud.service';
import { CreateMatchStatDto } from './dto/create-match_stat.dto';
import { UpdateMatchStatDto } from './dto/update-match_stat.dto';

@Injectable()
export class MatchStatsService extends BaseCrudService<MatchStat> {
  protected readonly logger = new Logger(MatchStatsService.name);

  constructor(
    @InjectRepository(MatchStat)
    private readonly matchStatRepository: Repository<MatchStat>,
    paginationService: PaginationService,
  ) {
    super(matchStatRepository, paginationService);
  }

  async create(dto: CreateMatchStatDto): Promise<MatchStat> {
    const exists = await this.matchStatRepository.findOneBy({
      fixtureId: dto.fixtureId,
      teamId: dto.teamId,
    });

    if (exists) {
      throw new ConflictException('Ya existe un registro con estos datos');
    }

    const nuevo = this.matchStatRepository.create(dto);
    return this.matchStatRepository.save(nuevo);
  }

  async updateMatchStat(id: number, dto: UpdateMatchStatDto): Promise<MatchStat> {
    const existing = await this.matchStatRepository.findOneBy({ id });
    if (!existing) {
      throw new NotFoundException(`No se encontró el registro con ID ${id}`);
    }

    const updated = this.matchStatRepository.merge(existing, dto);
    return this.matchStatRepository.save(updated);
  }
}
