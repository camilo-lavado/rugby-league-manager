import { Injectable, Logger, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { BaseCrudService } from '../common/services/base-crud.service';
import { User } from '../users/entities/user.entity';
import { PaginationService } from '../common/services/pagination.service';

@Injectable()
export class TeamsService extends BaseCrudService<Team> {
  protected readonly logger = new Logger(TeamsService.name);

  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    paginationService: PaginationService,
  ) {
    super(teamRepository, paginationService);
  }

  async create(dto: CreateTeamDto, user: User): Promise<Team> {
    this.logger.debug(`Creando equipo con nombre: ${dto.name}`);

    const existing = await this.teamRepository.findOneBy({ name: dto.name });
    if (existing) {
      this.logger.error(`Ya existe un equipo con el nombre ${dto.name}`);
      throw new ConflictException('Ya existe un registro con estos datos');
    }

    const nuevo = this.teamRepository.create({
      ...dto,
      createdBy: user,
    });

    return this.teamRepository.save(nuevo);
  }

  async updateTeam(id: number, dto: UpdateTeamDto, user: User): Promise<Team> {
    this.logger.debug(`Actualizando equipo ID ${id}`);

    const existing = await this.teamRepository.findOneBy({ id });
    if (!existing) {
      this.logger.error(`No se encontró el equipo con ID ${id}`);
      throw new NotFoundException(`No se encontró el registro con ID ${id}`);
    }

    if (dto.name) {
      const duplicate = await this.teamRepository.findOneBy({ name: dto.name });
      if (duplicate && duplicate.id !== id) {
        this.logger.error(`Ya existe otro equipo con el nombre ${dto.name}`);
        throw new ConflictException('Ya existe un registro con estos datos');
      }
    }

    const actualizado = this.teamRepository.merge(existing, {
      ...dto,
      updatedBy: user,
    });

    return this.teamRepository.save(actualizado);
  }
}
