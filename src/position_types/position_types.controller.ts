import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PositionTypesService } from './position_types.service';
import { CreatePositionTypeDto } from './dto/create-position_type.dto';
import { UpdatePositionTypeDto } from './dto/update-position_type.dto';

@Controller('position_types')
export class PositionTypesController {
  constructor(private readonly service: PositionTypesService) {}

  @Post()
  create(@Body() dto: CreatePositionTypeDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdatePositionTypeDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(+id);
  }
}
