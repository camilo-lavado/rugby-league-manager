import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PositionTypesService } from './position_types.service';
import { PositionTypesController } from './position_types.controller';
import { PositionType } from './entities/position_type.entity';
import { PaginationService } from '../common/services/pagination.service'; // ajusta si está en otra ruta

@Module({
  imports: [TypeOrmModule.forFeature([PositionType])],
  controllers: [PositionTypesController],
  providers: [PositionTypesService, PaginationService],
})
export class PositionTypesModule {}
