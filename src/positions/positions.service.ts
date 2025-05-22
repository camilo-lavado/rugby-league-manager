import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, IsNull, FindOptionsWhere } from 'typeorm';
import { Position } from './entities/position.entity';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { QueryPositionDto } from './dto/query-position.dto';
import { PaginationService } from '../common/services/pagination.service';

@Injectable()
export class PositionsService {
  private readonly logger = new Logger(PositionsService.name);

  constructor(
    @InjectRepository(Position)
    private readonly positionRepository: Repository<Position>,
    private readonly paginationService: PaginationService,
  ) {}

  async create(dto: CreatePositionDto): Promise<Position> {
    const exists = await this.positionRepository.findOneBy({
      name: dto.name,
      typeId: dto.typeId,
    });
    if (exists) {
      throw new ConflictException('Ya existe una posición con ese nombre y tipo');
    }
    const position = this.positionRepository.create(dto);
    return this.positionRepository.save(position);
  }

  async findAll(query: QueryPositionDto) {
    const { page = 1, limit = 10, search, typeId } = query;
    const where: FindOptionsWhere<Position>[] = [];

    if (search) {
      where.push({ name: ILike(`%${search}%`), deletedAt: IsNull() });
    }
    if (typeId !== undefined) {
      if (where.length > 0) {
        where.forEach((w, i) => (where[i] = { ...w, typeId }));
      } else {
        where.push({ typeId, deletedAt: IsNull() });
      }
    }
    if (where.length === 0) {
      where.push({ deletedAt: IsNull() });
    }

    return this.paginationService.paginate(this.positionRepository, {
      page,
      limit,
      where,
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Position> {
    const position = await this.positionRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
    if (!position) {
      throw new NotFoundException('Posición no encontrada');
    }
    return position;
  }

  async update(id: number, dto: UpdatePositionDto): Promise<Position> {
    const position = await this.findOne(id);
    Object.assign(position, dto);
    return this.positionRepository.save(position);
  }

  async remove(id: number): Promise<void> {
    const position = await this.findOne(id);
    await this.positionRepository.softRemove(position);
  }
}