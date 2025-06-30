import { Injectable, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchAggregate } from './entities/match_aggregate.entity';
import { CreateMatchAggregateDto } from './dto/create-match_aggregate.dto';
import { UpdateMatchAggregateDto } from './dto/update-match_aggregate.dto';
import { PaginationService } from '../common/services/pagination.service';
import { BaseCrudService } from '../common/services/base-crud.service';

@Injectable()
export class MatchAggregatesService extends BaseCrudService<MatchAggregate> {
  protected readonly logger = new Logger(MatchAggregatesService.name);

  constructor(
    @InjectRepository(MatchAggregate)
    protected readonly repository: Repository<MatchAggregate>,
    paginationService: PaginationService,
  ) {
    super(repository, paginationService);
  }

  async create(dto: CreateMatchAggregateDto): Promise<MatchAggregate> {
    const exists = await this.repository.findOneBy({ fixtureId: dto.fixtureId });

    if (exists) {
      throw new ConflictException('Ya existe un registro de MatchAggregate para este fixture');
    }

    const nuevo = this.repository.create(dto);
    return this.repository.save(nuevo);
  }

  async updateMatchAggregate(id: number, dto: UpdateMatchAggregateDto): Promise<MatchAggregate> {
    const existing = await this.repository.findOneBy({ id });
    if (!existing) {
      throw new NotFoundException(`No se encontró el registro con ID ${id}`);
    }

    const updated = this.repository.merge(existing, dto);
    return this.repository.save(updated);
  }
}
