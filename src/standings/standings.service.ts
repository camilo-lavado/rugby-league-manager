import { Injectable, ConflictException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Standing } from './entities/standing.entity';
import { BaseCrudService } from '../common/services/base-crud.service';
import { PaginationService } from '../common/services/pagination.service';
import { CreateStandingDto } from './dto/create-standing.dto';
import { UpdateStandingDto } from './dto/update-standing.dto';

@Injectable()
export class StandingsService extends BaseCrudService<Standing> {
  protected readonly logger = new Logger(StandingsService.name);

  constructor(
    @InjectRepository(Standing)
    private readonly standingRepository: Repository<Standing>,
    paginationService: PaginationService,
  ) {
    super(standingRepository, paginationService);
  }

  async create(dto: CreateStandingDto): Promise<Standing> {
    const existing = await this.standingRepository.findOneBy({
      leagueId: dto.leagueId,
      teamId: dto.teamId,
    });

    if (existing) {
      throw new ConflictException('Ya existe un registro con estos datos');
    }

    const created = this.standingRepository.create(dto);
    return this.standingRepository.save(created);
  }

  async updateStanding(id: number, dto: UpdateStandingDto): Promise<Standing> {
    const existing = await this.standingRepository.findOneBy({ id });

    if (!existing) {
      throw new NotFoundException(`No se encontró el registro con ID ${id}`);
    }

    const merged = this.standingRepository.merge(existing, dto);
    return this.standingRepository.save(merged);
  }
}
