import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { PositionType } from '../position_types/entities/position_type.entity';
import { CreatePositionTypeDto } from '../position_types/dto/create-position_type.dto';
import { UpdatePositionTypeDto } from '../position_types/dto/update-position_type.dto';
import { PaginationService } from '../common/services/pagination.service';
import { QueryPositionTypeDto } from './dto/query-position_type.dto.';

@Injectable()
export class PositionTypesService {
  private readonly logger = new Logger(PositionTypesService.name);

  constructor(
    @InjectRepository(PositionType)
    private readonly positionTypeRepository: Repository<PositionType>,
    private readonly _paginationService: PaginationService,
  ) {}

  async create(dto: CreatePositionTypeDto): Promise<PositionType> {
    const exists = await this.positionTypeRepository.findOneBy({ name: dto.name });
    if (exists) throw new ConflictException(`Ya existe un tipo de posición con nombre ${dto.name}`);

    const created = this.positionTypeRepository.create(dto);
    return this.positionTypeRepository.save(created);
  }

  async findAll(query: QueryPositionTypeDto) {
    const where: any = {};
    if (query.search) {
      where.name = ILike(`%${query.search}%`);
    }

    return this._paginationService.paginate(this.positionTypeRepository, {
      page: query.page,
      limit: query.limit,
      where,
      order: { name: 'ASC' },
    });
  }
  

  async findOne(id: number): Promise<PositionType> {
    const type = await this.positionTypeRepository.findOneBy({ id });
    if (!type) throw new NotFoundException(`Tipo de posición ${id} no encontrado`);
    return type;
  }

  async update(id: number, dto: UpdatePositionTypeDto): Promise<PositionType> {
    const type = await this.findOne(id);
    const updated = this.positionTypeRepository.merge(type, dto);
    return this.positionTypeRepository.save(updated);
  }
  

  async remove(id: number): Promise<void> {
    const type = await this.findOne(id);
    await this.positionTypeRepository.softRemove(type);
  }
}
