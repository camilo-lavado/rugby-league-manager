import {
  Controller,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { User as CurrentUser } from '../auth/decorators/user.decorator';

import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { CategoriesService } from './categories.service';
import { User } from '../users/entities/user.entity';
import { BaseCrudController } from '../common/controllers/base-crud.controller';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController extends BaseCrudController<
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
  QueryCategoryDto
> {
  constructor(private readonly categoriesService: CategoriesService) {
    super(categoriesService);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID de la categoría', type: Number })
  @ApiResponse({ status: 200, description: 'Categoría actualizada exitosamente' })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  @ApiNotFoundResponse({ description: 'Categoría no encontrada' })
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateCategoryDto,
    @CurrentUser() user: User,
  ): Promise<{ message: string; data: Category }> {
    const updated = await this.categoriesService.updateCategory(id, dto, user);
    return {
      message: 'Categoría actualizada exitosamente',
      data: updated,
    };
  }
}
