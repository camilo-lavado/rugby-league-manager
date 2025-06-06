import { Injectable, Logger, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { BaseCrudService } from '../common/services/base-crud.service';
import { User } from '../users/entities/user.entity';
import { PaginationService } from '../common/services/pagination.service';

@Injectable()
export class PlayersService extends BaseCrudService<Player> {
  protected readonly logger = new Logger(PlayersService.name);

  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    paginationService: PaginationService,
  ) {
    super(playerRepository, paginationService);
  }

  async create(dto: CreatePlayerDto, user: User): Promise<Player> {
    this.logger.debug(`Creando jugador con userId: ${dto.userId}, teamId: ${dto.teamId}`);

    const existing = await this.playerRepository.findOneBy({
      userId: dto.userId,
      teamId: dto.teamId,
    });

    if (existing) {
      this.logger.error(`Ya existe un jugador con userId ${dto.userId} en el equipo ${dto.teamId}`);
      throw new ConflictException('Ya existe un registro con estos datos');
    }

    const nuevo = this.playerRepository.create({
      ...dto,
      createdBy: user,
    });

    return this.playerRepository.save(nuevo);
  }

  async updatePlayer(id: number, dto: UpdatePlayerDto, user: User): Promise<Player> {
    this.logger.debug(`Actualizando jugador con ID ${id}`);

    const existing = await this.playerRepository.findOneBy({ id });
    if (!existing) {
      this.logger.error(`No se encontró el jugador con ID ${id}`);
      throw new NotFoundException(`No se encontró el registro con ID ${id}`);
    }

    if (dto.userId && dto.teamId) {
      const duplicate = await this.playerRepository.findOneBy({
        userId: dto.userId,
        teamId: dto.teamId,
      });

      if (duplicate && duplicate.id !== id) {
        this.logger.error(
          `Ya existe otro jugador con userId ${dto.userId} y teamId ${dto.teamId}`,
        );
        throw new ConflictException('Ya existe un registro con estos datos');
      }
    }

    const actualizado = this.playerRepository.merge(existing, {
      ...dto,
      updatedBy: user,
    });

    return this.playerRepository.save(actualizado);
  }
}
