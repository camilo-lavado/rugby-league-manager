import { Injectable, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Division } from './entities/division.entity';
import { CreateDivisionDto } from './dto/create-division.dto';
import { UpdateDivisionDto } from './dto/update-division.dto';
import { PaginationService } from '../common/services/pagination.service';
import { BaseCrudService } from '../common/services/base-crud.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class DivisionsService extends BaseCrudService<Division> {
  protected readonly logger = new Logger(DivisionsService.name);

  constructor(
    @InjectRepository(Division)
    private readonly divisionRepository: Repository<Division>,
    paginationService: PaginationService,
  ) {
    super(divisionRepository, paginationService);
  }

  async create(dto: CreateDivisionDto, user: User): Promise<Division> {
    this.logger.debug(`Creando división con nombre: ${dto.name}`);

    const existing = await this.divisionRepository.findOneBy({ name: dto.name });
    if (existing) {
      this.logger.error(`Ya existe una división con el nombre ${dto.name}`);
      throw new ConflictException('Ya existe un registro con estos datos');
    }

    const nueva = this.divisionRepository.create({
      ...dto,
    });

    return this.divisionRepository.save(nueva);
  }

  async updateDivision(id: number, dto: UpdateDivisionDto, user: User): Promise<Division> {
    this.logger.debug(`Actualizando división ID ${id}`);

    const existing = await this.divisionRepository.findOneBy({ id });
    if (!existing) {
      this.logger.error(`No se encontró la división con ID ${id}`);
      throw new NotFoundException(`No se encontró el registro con ID ${id}`);
    }

    if (dto.name) {
      const duplicate = await this.divisionRepository.findOneBy({ name: dto.name });
      if (duplicate && duplicate.id !== id) {
        this.logger.error(`Ya existe otra división con el nombre ${dto.name}`);
        throw new ConflictException('Ya existe un registro con estos datos');
      }
    }

    const actualizado = this.divisionRepository.merge(existing, {
      ...dto,
      // updatedBy: user, // Removed because 'updatedBy' does not exist in Division entity
    });

    return this.divisionRepository.save(actualizado);
  }
}
