import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
  NotFoundException,
  UseGuards,
  Query,
  Patch,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import {
  ApiTags,
  ApiResponse,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { QueryCategoryDto } from './dto/query-category.dto';
import { User } from '../users/entities/user.entity';
import { User as CurrentUser } from '../auth/decorators/user.decorator';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Category created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @CurrentUser() user: User,
  ): Promise<{ message: string; data: Category }> {
    const category = await this.categoriesService.create(createCategoryDto, user);
    return {
      message: 'Category created successfully',
      data: category,
    };
  }

  @Get()
  @ApiResponse({ status: 200, description: 'List of categories retrieved successfully' })
  async findAll(
    @Query() query: QueryCategoryDto,
  ): Promise<{
    message: string;
    data: Category[];
    meta: {
      total: number;
      page: number;
      limit: number;
    };
  }> {
    const result = await this.categoriesService.findAll(query);
    if (!result.data || result.data.length === 0) {
      throw new NotFoundException('No categories found');
    }
    return {
      message: 'Categories retrieved successfully',
      data: result.data,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
      },
    };
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Category retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  async findOne(@Param('id') id: number): Promise<{ message: string; data: Category }> {
    const category = await this.categoriesService.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return {
      message: 'Category retrieved successfully',
      data: category,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiParam({ name: 'id', description: 'Category ID', type: Number })
  async update(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @CurrentUser() user: User,
  ): Promise<{ message: string; data: Category }> {
    const category = await this.categoriesService.update(id, updateCategoryDto, user);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return {
      message: 'Category updated successfully',
      data: category,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @ApiParam({ name: 'id', description: 'Category ID', type: Number })
  async remove(
    @Param('id') id: number,
    @CurrentUser() user: User,
  ): Promise<{ message: string }> {
    await this.categoriesService.delete(id, user);
    return {
      message: 'Category deleted successfully',
    };
  }
}