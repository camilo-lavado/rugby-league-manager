// src/positions/position-type.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { PositionTypesService } from './position_types.service';
import { CreatePositionTypeDto } from './dto/create-position_type.dto';
import { UpdatePositionTypeDto } from './dto/update-position_type.dto';
import { QueryPositionTypeDto } from './dto/query-position_type.dto.';

@Controller('position-types')
export class PositionTypesController {
  constructor(private readonly service: PositionTypesService) {}

  @Post()
  create(@Body() dto: CreatePositionTypeDto) {
    return this.service.create(dto);
  }

  @Get()
findAll(@Query() query: QueryPositionTypeDto) {
  return this.service.findAll(query);
}


  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePositionTypeDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id')
  partialUpdate(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePositionTypeDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
