import { Injectable, ConflictException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Stadium } from './entities/stadium.entity';
import { CreateStadiumDto } from './dto/create-stadium.dto';
import { UpdateStadiumDto } from './dto/update-stadium.dto';
import { PaginationService } from '../common/services/pagination.service';
import { BaseCrudService } from '../common/services/base-crud.service';
import { User } from '../users/entities/user.entity';
import { QueryStadiumDto } from './dto/query-stadium.dto';

@Injectable()
export class StadiumsService extends BaseCrudService<Stadium> {
  protected readonly logger = new Logger(StadiumsService.name);

  constructor(
    @InjectRepository(Stadium)
    private readonly stadiumRepository: Repository<Stadium>,
    paginationService: PaginationService,
  ) {
    super(stadiumRepository, paginationService);
  }

  async create(dto: CreateStadiumDto, user: User): Promise<Stadium> {
    this.logger.debug(`Creando estadio con nombre: ${dto.name}`);

    const existing = await this.stadiumRepository.findOneBy({ name: dto.name });
    if (existing) {
      this.logger.error(`Ya existe un estadio con el nombre ${dto.name}`);
      throw new ConflictException('Ya existe un registro con estos datos');
    }

    const nuevo = this.stadiumRepository.create({ ...dto, createdBy: user });
    return this.stadiumRepository.save(nuevo);
  }

  async updateStadium(id: number, dto: UpdateStadiumDto, user: User): Promise<Stadium> {
    const existing = await this.stadiumRepository.findOneBy({ id });
    if (!existing) {
      throw new NotFoundException(`No se encontró el estadio con ID ${id}`);
    }

    if (dto.name) {
      const duplicate = await this.stadiumRepository.findOneBy({ name: dto.name });
      if (duplicate && duplicate.id !== id) {
        throw new ConflictException('Ya existe un registro con estos datos');
      }
    }

    const actualizado = this.stadiumRepository.merge(existing, {
      ...dto,
      updatedBy: user,
    });

    return this.stadiumRepository.save(actualizado);
  }

  async findAll(query: QueryStadiumDto) {
    const { name, location, page = 1, limit = 10 } = query;

    const where = {};
    if (name) Object.assign(where, { name: Like(`%${name}%`) });
    if (location) Object.assign(where, { location: Like(`%${location}%`) });

    return this.paginationService.paginate<Stadium>(
      this.stadiumRepository,
      {
        page,
        limit,
        where,
      }
    );
  }
}
