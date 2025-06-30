import { Injectable, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Score } from './entities/score.entity';
import { CreateScoreDto } from './dto/create-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
import { PaginationService } from '../common/services/pagination.service';
import { BaseCrudService } from '../common/services/base-crud.service';

@Injectable()
export class ScoresService extends BaseCrudService<Score> {
  protected readonly logger = new Logger(ScoresService.name);

  constructor(
    @InjectRepository(Score)
    private readonly scoreRepository: Repository<Score>,
    paginationService: PaginationService,
  ) {
    super(scoreRepository, paginationService);
  }

  async create(dto: CreateScoreDto): Promise<Score> {
    const exists = await this.scoreRepository.findOneBy({
      fixtureId: dto.fixtureId,
      teamId: dto.teamId,
    });

    if (exists) {
      throw new ConflictException('Ya existe un registro de score para este fixture y equipo');
    }

    const nuevo = this.scoreRepository.create(dto);
    return this.scoreRepository.save(nuevo);
  }

  async updateScore(id: number, dto: UpdateScoreDto): Promise<Score> {
    const existing = await this.scoreRepository.findOneBy({ id });
    if (!existing) {
      throw new NotFoundException(`No se encontró el score con ID ${id}`);
    }

    const actualizado = this.scoreRepository.merge(existing, dto);
    return this.scoreRepository.save(actualizado);
  }
}
