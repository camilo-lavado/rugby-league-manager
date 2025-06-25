import { Injectable, ConflictException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fixture } from './entities/fixture.entity';
import { CreateFixtureDto } from './dto/create-fixture.dto';
import { UpdateFixtureDto } from './dto/update-fixture.dto';
import { PaginationService } from '../common/services/pagination.service';
import { BaseCrudService } from '../common/services/base-crud.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class FixturesService extends BaseCrudService<Fixture> {
  protected readonly logger = new Logger(FixturesService.name);

  constructor(
    @InjectRepository(Fixture)
    private readonly fixtureRepository: Repository<Fixture>,
    paginationService: PaginationService,
  ) {
    super(fixtureRepository, paginationService);
  }

  async create(dto: CreateFixtureDto, user: User): Promise<Fixture> {
    this.logger.debug(`Creando fixture con fecha: ${dto.matchDate}`);

    const nuevo = this.fixtureRepository.create({ ...dto, createdBy: user });
    return this.fixtureRepository.save(nuevo);
  }

  async updateFixture(id: number, dto: UpdateFixtureDto, user: User): Promise<Fixture> {
    const existing = await this.fixtureRepository.findOneBy({ id });
    if (!existing) {
      throw new NotFoundException(`No se encontró el fixture con ID ${id}`);
    }

    const actualizado = this.fixtureRepository.merge(existing, {
      ...dto,
      updatedBy: user,
    });

    return this.fixtureRepository.save(actualizado);
  }
}
