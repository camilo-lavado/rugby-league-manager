import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PositionType } from './entities/position_type.entity';
import { CreatePositionTypeDto } from './dto/create-position_type.dto';
import { UpdatePositionTypeDto } from './dto/update-position_type.dto';

@Injectable()
export class PositionTypesService {
  constructor(
    @InjectRepository(PositionType)
    private readonly repository: Repository<PositionType>,
  ) {}

  create(dto: CreatePositionTypeDto) {
    const entity = this.repository.create(dto);
    return this.repository.save(entity);
  }

  findAll() {
    return this.repository.find();
  }

  async findOne(id: number) {
    const found = await this.repository.findOneBy({ id });
    if (!found) {
      throw new NotFoundException(`No se encontró position_type con ID ${id}`);
    }
    return found;
  }

  async update(id: number, dto: UpdatePositionTypeDto) {
    const existing = await this.findOne(id);
    const updated = this.repository.merge(existing, dto);
    return this.repository.save(updated);
  }

  async remove(id: number) {
    const existing = await this.findOne(id);
    return this.repository.softRemove(existing);
  }
}
