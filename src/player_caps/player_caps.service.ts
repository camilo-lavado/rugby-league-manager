import { Injectable, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayerCap } from './entities/player_cap.entity';
import { PaginationService } from '../common/services/pagination.service';
import { BaseCrudService } from '../common/services/base-crud.service';
import { CreatePlayerCapDto } from './dto/create-player_cap.dto';
import { UpdatePlayerCapDto } from './dto/update-player_cap.dto';

@Injectable()
export class PlayerCapsService extends BaseCrudService<PlayerCap> {
  protected readonly logger = new Logger(PlayerCapsService.name);

  constructor(
    @InjectRepository(PlayerCap)
    private readonly playerCapRepository: Repository<PlayerCap>,
    paginationService: PaginationService,
  ) {
    super(playerCapRepository, paginationService);
  }

  async create(dto: CreatePlayerCapDto): Promise<PlayerCap> {
    const exists = await this.playerCapRepository.findOneBy({
      playerId: dto.playerId,
      fixtureId: dto.fixtureId,
    });

    if (exists) {
      throw new ConflictException('Ya existe un registro con estos datos');
    }

    const nuevo = this.playerCapRepository.create(dto);
    return this.playerCapRepository.save(nuevo);
  }

  async updatePlayerCap(id: number, dto: UpdatePlayerCapDto): Promise<PlayerCap> {
    const existing = await this.playerCapRepository.findOneBy({ id });
    if (!existing) {
      throw new NotFoundException(`No se encontró el registro con ID ${id}`);
    }

    const updated = this.playerCapRepository.merge(existing, dto);
    return this.playerCapRepository.save(updated);
  }
}
