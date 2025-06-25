import { Injectable, Logger, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Position } from './entities/position.entity';
import { PaginationService } from '../common/services/pagination.service';
import { BaseCrudService } from '../common/services/base-crud.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PositionsService extends BaseCrudService<Position> {
  protected readonly logger = new Logger(PositionsService.name);

  constructor(
    @InjectRepository(Position)
    private readonly positionRepository: Repository<Position>,
    paginationService: PaginationService,
  ) {
    super(positionRepository, paginationService);
  }

  async create(dto: CreatePositionDto, user: User): Promise<Position> {
    this.logger.debug(`Creando posición con nombre: ${dto.name}`);

    const existing = await this.positionRepository.findOneBy({ name: dto.name });
    if (existing) {
      this.logger.error(`Ya existe una posición con el nombre ${dto.name}`);
      throw new ConflictException('Ya existe un registro con estos datos');
    }

    const nueva = this.positionRepository.create({ ...dto, createdBy: user });
    return this.positionRepository.save(nueva);
  }

  async updatePosition(id: number, dto: UpdatePositionDto, user: User): Promise<Position> {
    this.logger.debug(`Actualizando posición ID ${id}`);

    const existing = await this.positionRepository.findOneBy({ id });
    if (!existing) {
      this.logger.error(`No se encontró la posición con ID ${id}`);
      throw new NotFoundException(`No se encontró el registro con ID ${id}`);
    }

    if (dto.name) {
      const duplicate = await this.positionRepository.findOneBy({ name: dto.name });
      if (duplicate && duplicate.id !== id) {
        this.logger.error(`Ya existe otra posición con el nombre ${dto.name}`);
        throw new ConflictException('Ya existe un registro con estos datos');
      }
    }

    const actualizado = this.positionRepository.merge(existing, {
      ...dto,
      updatedBy: user,
    });

    return this.positionRepository.save(actualizado);
  }
}
