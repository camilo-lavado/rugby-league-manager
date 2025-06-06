// src/common/controllers/base-crud.controller.ts
import {
    Body,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Logger,
    NotFoundException,
    UseGuards,
  } from '@nestjs/common';
  import {
    ApiBearerAuth,
    ApiBadRequestResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiParam,
    ApiCreatedResponse,
  } from '@nestjs/swagger';
  import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
  import { RolesGuard } from '../../auth/guards/roles.guard';
  import { Roles } from '../../auth/decorators/roles.decorator';
  import { User } from '../../users/entities/user.entity';
  import { User as CurrentUser } from '../../auth/decorators/user.decorator';
  
  export abstract class BaseCrudController<T, CreateDto, UpdateDto, QueryDto> {
    protected readonly logger = new Logger(this.constructor.name);
  
    constructor(protected readonly service: any) {}
  
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @ApiCreatedResponse({ description: 'Elemento creado exitosamente' })
    @ApiBadRequestResponse({ description: 'Datos inválidos' })
    async create(
      @Body() dto: CreateDto,
      @CurrentUser() user: User,
    ): Promise<{ message: string; data: T }> {
      try {
        const data = await this.service.create(dto, user);
        return { message: 'Elemento creado exitosamente', data };
      } catch (error) {
        this.logger.error('Error en create()', error.stack);
        throw error;
      }
    }
  
    @Get()
    @ApiOkResponse({ description: 'Lista obtenida exitosamente' })
    async findAll(
      @Query() query: QueryDto,
    ): Promise<{ message: string; data: T[]; meta: any }> {
      try {
        const result = await this.service.findAll(query);
        if (!result.data || result.data.length === 0) {
          throw new NotFoundException('No se encontraron resultados');
        }
  
        return {
          message: 'Elementos obtenidos exitosamente',
          data: result.data,
          meta: {
            total: result.total,
            page: result.page,
            limit: result.limit,
          },
        };
      } catch (error) {
        this.logger.error('Error en findAll()', error.stack);
        throw error;
      }
    }
  
    @Get(':id')
    @ApiOkResponse({ description: 'Elemento encontrado' })
    @ApiNotFoundResponse({ description: 'No encontrado' })
    @ApiParam({ name: 'id', type: Number })
    async findOne(
      @Param('id') id: number,
    ): Promise<{ message: string; data: T }> {
      try {
        const data = await this.service.findById(id);
        return { message: 'Elemento encontrado', data };
      } catch (error) {
        this.logger.error(`Error en findOne(${id})`, error.stack);
        throw error;
      }
    }
  
    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Elemento actualizado exitosamente' })
    @ApiBadRequestResponse({ description: 'Datos inválidos' })
    @ApiNotFoundResponse({ description: 'No encontrado' })
    async update(
      @Param('id') id: number,
      @Body() dto: UpdateDto,
      @CurrentUser() user: User,
    ): Promise<{ message: string; data: T }> {
      try {
        const data = await this.service.update(id, dto, user);
        if (!data) {
          throw new NotFoundException(`No se encontró el elemento con ID ${id}`);
        }
        return { message: 'Elemento actualizado exitosamente', data };
      } catch (error) {
        this.logger.error(`Error en update(${id})`, error.stack);
        throw error;
      }
    }
  
    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Elemento eliminado exitosamente' })
    @ApiNotFoundResponse({ description: 'No encontrado' })
    async delete(
      @Param('id') id: number,
      @CurrentUser() user: User,
    ): Promise<{ message: string }> {
      try {
        await this.service.delete(id, user);
        return { message: 'Elemento eliminado exitosamente' };
      } catch (error) {
        this.logger.error(`Error en delete(${id})`, error.stack);
        throw error;
      }
    }
  }
  