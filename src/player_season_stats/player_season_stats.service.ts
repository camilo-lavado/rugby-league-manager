import { Injectable, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayerSeasonStat } from './entities/player_season_stat.entity';
import { CreatePlayerSeasonStatDto } from './dto/create-player_season_stat.dto';
import { UpdatePlayerSeasonStatDto } from './dto/update-player_season_stat.dto';
import { PaginationService } from '../common/services/pagination.service';
import { BaseCrudService } from '../common/services/base-crud.service';

@Injectable()
export class PlayerSeasonStatsService extends BaseCrudService<PlayerSeasonStat> {
  protected readonly logger = new Logger(PlayerSeasonStatsService.name);

  constructor(
    @InjectRepository(PlayerSeasonStat)
    repository: Repository<PlayerSeasonStat>,
    paginationService: PaginationService,
  ) {
    super(repository, paginationService);
  }

  async create(dto: CreatePlayerSeasonStatDto): Promise<PlayerSeasonStat> {
    const exists = await this.repository.findOneBy({
      playerId: dto.playerId,
      seasonId: dto.seasonId,
    });

    if (exists) {
      throw new ConflictException('Ya existe un registro con estos datos');
    }

    const nuevo = this.repository.create(dto);
    return this.repository.save(nuevo);
  }

  async updatePlayerSeasonStat(id: number, dto: UpdatePlayerSeasonStatDto): Promise<PlayerSeasonStat> {
    const existing = await this.repository.findOneBy({ id });
    if (!existing) {
      throw new NotFoundException(`No se encontró el registro con ID ${id}`);
    }

    const updated = this.repository.merge(existing, dto);
    return this.repository.save(updated);
  }
}
