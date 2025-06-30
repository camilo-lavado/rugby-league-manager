import { Injectable, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchParticipation } from './entities/match_participation.entity';
import { BaseCrudService } from '../common/services/base-crud.service';
import { PaginationService } from '../common/services/pagination.service';
import { CreateMatchParticipationDto } from './dto/create-match_participation.dto';
import { UpdateMatchParticipationDto } from './dto/update-match_participation.dto';

@Injectable()
export class MatchParticipationService extends BaseCrudService<MatchParticipation> {
  protected readonly logger = new Logger(MatchParticipationService.name);

  constructor(
    @InjectRepository(MatchParticipation)
    private readonly matchParticipationRepository: Repository<MatchParticipation>,
    paginationService: PaginationService,
  ) {
    super(matchParticipationRepository, paginationService);
  }

  async create(dto: CreateMatchParticipationDto): Promise<MatchParticipation> {
    const exists = await this.matchParticipationRepository.findOneBy({
      fixtureId: dto.fixtureId,
      playerId: dto.playerId,
    });

    if (exists) {
      throw new ConflictException('Ya existe un registro con estos datos');
    }

    const nuevo = this.matchParticipationRepository.create(dto);
    return this.matchParticipationRepository.save(nuevo);
  }

  async updateMatchParticipation(id: number, dto: UpdateMatchParticipationDto): Promise<MatchParticipation> {
    const existing = await this.matchParticipationRepository.findOneBy({ id });
    if (!existing) {
      throw new NotFoundException(`No se encontró el registro con ID ${id}`);
    }

    const updated = this.matchParticipationRepository.merge(existing, dto);
    return this.matchParticipationRepository.save(updated);
  }
}
