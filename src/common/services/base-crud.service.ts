import {
    ConflictException,
    Injectable,
    Logger,
    NotFoundException,
  } from '@nestjs/common';
  import {
    DeepPartial,
    FindOptionsWhere,
    FindOptionsOrder,
    ObjectLiteral,
    Repository,
    ILike,
    IsNull,
  } from 'typeorm';
  import { PaginationService } from './pagination.service';
  
  @Injectable()
  export abstract class BaseCrudService<T extends ObjectLiteral> {
    protected readonly logger = new Logger(this.constructor.name);
  
    constructor(
      protected readonly repository: Repository<T>,
      protected readonly paginationService: PaginationService,
    ) {}
  
    async create(
      data: DeepPartial<T>,
      uniqueFields: Partial<T> = {},
    ): Promise<T> {
      try {
        const exists = await this.repository.findOneBy(
          uniqueFields as FindOptionsWhere<T>,
        );
        if (exists) {
          this.logger.warn('Intento de duplicación detectado');
          throw new ConflictException('Ya existe un registro con estos datos');
        }
        const entity = this.repository.create(data);
        const saved = await this.repository.save(entity);
        this.logger.log(`Registro creado con ID ${saved['id']}`);
        return saved;
      } catch (error) {
        this.logger.error('Error al crear registro', error.stack);
        throw error;
      }
    }
  
    async findAll({
      page = 1,
      limit = 10,
      search,
      additionalWhere = {},
      relations = [],
      order = {} as FindOptionsOrder<T>,
    }: {
      page?: number;
      limit?: number;
      search?: string;
      additionalWhere?: FindOptionsWhere<T>;
      relations?: string[];
      order?: FindOptionsOrder<T>;
    }) {
      try {
        const where: FindOptionsWhere<T>[] = [];
  
        if (search) {
          where.push({
            ...(search ? { name: ILike(`%${search}%`) } : {}),
            ...additionalWhere,
            deletedAt: IsNull(),
          });
        } else {
          where.push({ ...additionalWhere, deletedAt: IsNull() });
        }
  
        this.logger.log(`Buscando registros con filtros: ${JSON.stringify(where)}`);
  
        return this.paginationService.paginate(this.repository, {
          page,
          limit,
          where,
          relations,
          order,
        });
      } catch (error) {
        this.logger.error('Error al obtener registros', error.stack);
        throw error;
      }
    }
  
    async findById(id: number): Promise<T> {
      try {
        const entity = await this.repository.findOneBy(
          { id } as unknown as FindOptionsWhere<T>,
        );
        if (!entity) {
          this.logger.warn(`Registro con ID ${id} no encontrado`);
          throw new NotFoundException(`No se encontró el registro con ID ${id}`);
        }
        this.logger.log(`Registro encontrado con ID ${id}`);
        return entity;
      } catch (error) {
        this.logger.error(`Error al buscar registro con ID ${id}`, error.stack);
        throw error;
      }
    }
  
    async update(id: number, dto: DeepPartial<T>): Promise<T> {
      try {
        const entity = await this.findById(id);
        const updated = this.repository.merge(entity, dto);
        const result = await this.repository.save(updated);
        this.logger.log(`Registro actualizado con ID ${id}`);
        return result;
      } catch (error) {
        this.logger.error(`Error al actualizar registro con ID ${id}`, error.stack);
        throw error;
      }
    }
  
    async delete(id: number): Promise<void> {
      try {
        const entity = await this.findById(id);
        this.logger.log(`Eliminando lógicamente registro con ID ${id}`);
        await this.repository.save({
          ...entity,
          deletedAt: new Date(),
        });
        await this.repository.softRemove(entity);
      } catch (error) {
        this.logger.error(`Error al eliminar registro con ID ${id}`, error.stack);
        throw error;
      }
    }
  
    async restore(id: number): Promise<void> {
      try {
        await this.repository.restore(id);
        this.logger.log(`Registro restaurado con ID ${id}`);
      } catch (error) {
        this.logger.error(`Error al restaurar registro con ID ${id}`, error.stack);
        throw error;
      }
    }
  }
  