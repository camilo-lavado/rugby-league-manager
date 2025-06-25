import { Injectable, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Season } from './entities/season.entity';
import { CreateSeasonDto } from './dto/create-season.dto';
import { UpdateSeasonDto } from './dto/update-season.dto';
import { PaginationService } from '../common/services/pagination.service';
import { BaseCrudService } from '../common/services/base-crud.service';

@Injectable()
export class SeasonsService extends BaseCrudService<Season> {
  protected readonly logger = new Logger(SeasonsService.name);

  constructor(
    @InjectRepository(Season)
    private readonly seasonRepository: Repository<Season>,
    paginationService: PaginationService,
  ) {
    super(seasonRepository, paginationService);
  }

  async create(dto: CreateSeasonDto): Promise<Season> {
    this.logger.debug(`Creando temporada con nombre: ${dto.name}`);

    const existing = await this.seasonRepository.findOneBy({ name: dto.name });
    if (existing) {
      this.logger.error(`Ya existe una temporada con el nombre ${dto.name}`);
      throw new ConflictException('Ya existe un registro con estos datos');
    }

    const nueva = this.seasonRepository.create(dto);
    return this.seasonRepository.save(nueva);
  }

  async updateSeason(id: number, dto: UpdateSeasonDto): Promise<Season> {
    this.logger.debug(`Actualizando temporada ID ${id}`);

    const existing = await this.seasonRepository.findOneBy({ id });
    if (!existing) {
      throw new NotFoundException(`No se encontró la temporada con ID ${id}`);
    }

    if (dto.name) {
      const duplicate = await this.seasonRepository.findOneBy({ name: dto.name });
      if (duplicate && duplicate.id !== id) {
        this.logger.error(`Conflicto: otra temporada ya tiene el nombre ${dto.name}`);
        throw new ConflictException('Ya existe un registro con estos datos');
      }
    }

    const actualizado = this.seasonRepository.merge(existing, dto);
    return this.seasonRepository.save(actualizado);
  }
}
