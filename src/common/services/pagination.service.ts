import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';

@Injectable()
export class PaginationService {
  async paginate<T extends ObjectLiteral>(
    repo: Repository<T>,
    options: {
      page?: number;
      limit?: number;
      where?: FindOptionsWhere<T>[] | FindOptionsWhere<T>;
      order?: FindManyOptions<T>['order'];
      relations?: string[];
    },
  ): Promise<{
    data: T[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = options.page || 1;
    const limit = options.limit || 10;

    const [data, total] = await repo.findAndCount({
      where: options.where,
      order: options.order,
      relations: options.relations,
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }
}
