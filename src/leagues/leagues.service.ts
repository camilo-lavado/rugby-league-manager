import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  Not,
  IsNull, // 👈 importar aquí
} from 'typeorm';
import { League } from './league.entity';
import { CreateLeagueDto } from './dto/create-league.dto';
import { UpdateLeagueDto } from './dto/update-league.dto';
import { User } from '../users/entities/user.entity';
import { PaginationService } from '../common/services/pagination.service';
import { BaseCrudService } from '../common/services/base-crud.service';

@Injectable()
export class LeaguesService extends BaseCrudService<League> {
  constructor(
    @InjectRepository(League)
    readonly leagueRepository: Repository<League>,
    private readonly pagination: PaginationService,
  ) {
    super(leagueRepository, pagination);
  }

  async create(dto: CreateLeagueDto, user: User) {
    return super.create({ ...dto, createdBy: user }, { name: dto.name });
  }

  // 👇 NO sobrescribas el método base, usa un método nuevo
  async updateWithUser(id: number, dto: UpdateLeagueDto, user: User) {
    if (dto.name) {
      const conflict = await this.repository.findOneBy({ name: dto.name });
      if (conflict && conflict.id !== id) {
        throw new ConflictException(`Ya existe una liga con el nombre ${dto.name}`);
      }
    }
    return super.update(id, { ...dto, updatedBy: user });
  }

  async deleteWithUser(id: number, user: User) {
    const league = await this.findById(id);
    league.deletedBy = user;
    league.deletedAt = new Date();
    await this.repository.save(league);
    await this.repository.softRemove(league);
  }

  async restore(id: number) {
    return super.restore(id);
  }

  async findDeleted() {
    return this.repository.find({
      where: { deletedAt: Not(IsNull()) },
      withDeleted: true,
    });
  }
}
