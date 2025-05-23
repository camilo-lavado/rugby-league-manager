import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository, ILike, FindOptionsWhere } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { User } from '../users/entities/user.entity';
import { PaginationService } from '../common/services/pagination.service';

@Injectable()
export class CategoriesService {
  logger = new Logger(CategoriesService.name);
  
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly paginationService: PaginationService,
  ) {}

  async create(dto: CreateCategoryDto, user?: User): Promise<Category> {
    const category = this.categoryRepository.create({
      ...dto,
      createdBy: user,
    });
    
    this.logger.log(`Creating category: ${category.name}`);
    
    const existingCategory = await this.categoryRepository.findOneBy({ 
      name: category.name, 
      type: category.type 
    });
    
    if (existingCategory) {
      throw new ConflictException(`Ya existe una categoría con el nombre ${category.name} y tipo ${category.type}`);
    }
    
    this.logger.log(`Category created: ${category.name}`);
    this.logger.log(`Category created by: ${user?.email}`);
    
    return this.categoryRepository.save(category);
  }

  async findAll(query: QueryCategoryDto) {
    const { page = 1, limit = 10, search, type } = query;
  
    const where: FindOptionsWhere<Category>[] = [];
  
    if (search) {
      where.push({ name: ILike(`%${search}%`), deletedAt: IsNull() });
    }
  
    if (type) {
      where.push({ type: ILike(`%${type}%`), deletedAt: IsNull() });
    }
  
    if (!search && !type) {
      where.push({ deletedAt: IsNull() });
    }
  
    return this.paginationService.paginate(this.categoryRepository, {
      page,
      limit,
      where,
      order: { name: 'ASC' },
      relations: ['createdBy', 'updatedBy', 'deletedBy'],
    });
  }
  
  async findById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(id: number, dto: UpdateCategoryDto, user?: User): Promise<Category> {
    const category = await this.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    } 
    
    this.logger.log(`Updating category: ${category.name}`);
    
    if (dto.name && dto.type) {
      const existingCategory = await this.categoryRepository.findOneBy({ 
        name: dto.name, 
        type: dto.type 
      });
      if (existingCategory && existingCategory.id !== id) {
        throw new ConflictException(`Ya existe una categoría con el nombre ${dto.name} y tipo ${dto.type}`);
      }
    }
    
    this.logger.log(`Category updated: ${category.name}`);
    this.logger.log(`Category updated by: ${user?.email}`);
    
    this.categoryRepository.merge(category, { ...dto, updatedBy: user });
    return this.categoryRepository.save(category);
  }

  async delete(id: number, user?: User): Promise<void> {
    const category = await this.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    
    this.logger.log(`Deleting category: ${category.name}`);
    category.deletedBy = user;
    category.deletedAt = new Date();
    await this.categoryRepository.save(category);
    this.logger.log(`Category deleted: ${category.name}`);
    await this.categoryRepository.softRemove(category);
    this.logger.log(`Category deleted by: ${user?.email}`);
  }
}