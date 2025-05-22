import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike, IsNull } from 'typeorm';
import { Player } from './entities/player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { QueryPlayerDto } from './dto/query-player.dto';
import { User } from '../users/entities/user.entity';
import { PaginationService } from '../common/services/pagination.service';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);

  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    private readonly paginationService: PaginationService,
  ) {}

  async create(dto: CreatePlayerDto, user?: User): Promise<Player> {
    const exists = await this.playerRepository.findOne({
      where: { userId: dto.userId, teamId: dto.teamId, deletedAt: IsNull() },
    });

    if (exists) {
      throw new ConflictException(
        `El jugador para el usuario ${dto.userId} en el equipo ${dto.teamId} ya existe`,
      );
    }

    const player = this.playerRepository.create({ ...dto });
    this.logger.log(`Creando jugador para usuario: ${dto.userId} en equipo: ${dto.teamId}`);

    const saved = await this.playerRepository.save(player);

    this.logger.log(`Jugador creado con ID: ${saved.id}`);
    return saved;
  }

  async findAll(query: QueryPlayerDto) {
    const { page = 1, limit = 10, search, teamId, userId } = query;

    const where: FindOptionsWhere<Player>[] = [];

    if (search) {
      where.push({
        user: { email: ILike(`%${search}%`) }, 
        deletedAt: IsNull(),
      });
    }

    if (teamId) {
      where.push({ teamId, deletedAt: IsNull() });
    }

    if (userId) {
      where.push({ userId, deletedAt: IsNull() });
    }

    if (!search && !teamId && !userId) {
      where.push({ deletedAt: IsNull() });
    }

    return this.paginationService.paginate(this.playerRepository, {
      page,
      limit,
      where,
      relations: ['user', 'team'],
      order: { id: 'ASC' },
    });
  }

  async findById(id: number): Promise<Player> {
    const player = await this.playerRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['user', 'team'],
    });

    if (!player) {
      throw new NotFoundException(`Jugador con ID ${id} no encontrado`);
    }
    return player;
  }

  async update(id: number, dto: UpdatePlayerDto, user?: User): Promise<Player> {
    const player = await this.findById(id);
    this.logger.log(`Actualizando jugador con ID: ${id}`);
    this.logger.log(`Datos actuales: ${JSON.stringify(player)}`);
    if ((dto.userId && dto.userId !== player.userId) || (dto.teamId && dto.teamId !== player.teamId)) {
      const exists = await this.playerRepository.findOne({
        where: {
          userId: dto.userId ?? player.userId,
          teamId: dto.teamId ?? player.teamId,
          deletedAt: IsNull(),
        },
      });
      if (exists && exists.id !== id) {
        throw new ConflictException(
          `Ya existe un jugador para el usuario ${dto.userId ?? player.userId} en el equipo ${dto.teamId ?? player.teamId}`,
        );
      }
    }

    this.logger.log(`Actualizando jugador con ID: ${id}`);
    this.playerRepository.merge(player, dto);
    const updated = await this.playerRepository.save(player);
    this.logger.log(`Jugador actualizado con ID: ${updated.id}`);

    return updated;
  }

  async delete(id: number, user?: User): Promise<void> {
    const player = await this.findById(id);
    this.logger.log(`Eliminando jugador con ID: ${id}`);

    player.deletedBy = user;
    player.deletedAt = new Date();

    await this.playerRepository.save(player);
    await this.playerRepository.softRemove(player);

    this.logger.log(`Jugador eliminado con ID: ${id} por usuario: ${user?.email}`);
  }
}
