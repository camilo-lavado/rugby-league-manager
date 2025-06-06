import { Injectable, Logger, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { BaseCrudService } from '../common/services/base-crud.service';
import { User } from '../users/entities/user.entity';
import { PaginationService } from '../common/services/pagination.service';

@Injectable()
export class CategoriesService extends BaseCrudService<Category> {
  protected readonly logger = new Logger(CategoriesService.name);

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    paginationService: PaginationService,
  ) {
    super(categoryRepository, paginationService);
  }

  async create(dto: CreateCategoryDto, user: User): Promise<Category> {
    this.logger.debug(`Creando categoría con nombre: ${dto.name}`);

    const existing = await this.categoryRepository.findOneBy({ name: dto.name });
    if (existing) {
      this.logger.error(`Ya existe una categoría con el nombre ${dto.name}`);
      throw new ConflictException('Ya existe un registro con estos datos');
    }

    const nueva = this.categoryRepository.create({
      ...dto,
      createdBy: user,
    });

    return this.categoryRepository.save(nueva);
  }

  async updateCategory(id: number, dto: UpdateCategoryDto, user: User): Promise<Category> {
    this.logger.debug(`Actualizando categoría ID ${id}`);

    const existing = await this.categoryRepository.findOneBy({ id });
    if (!existing) {
      this.logger.error(`No se encontró la categoría con ID ${id}`);
      throw new NotFoundException(`No se encontró el registro con ID ${id}`);
    }

    if (dto.name) {
      const duplicate = await this.categoryRepository.findOneBy({ name: dto.name });
      if (duplicate && duplicate.id !== id) {
        this.logger.error(`Ya existe otra categoría con el nombre ${dto.name}`);
        throw new ConflictException('Ya existe un registro con estos datos');
      }
    }

    const actualizado = this.categoryRepository.merge(existing, {
      ...dto,
      updatedBy: user,
    });

    return this.categoryRepository.save(actualizado);
  }
}
