import { Module } from '@nestjs/common';
import { PositionTypesService } from './position_types.service';
import { PositionTypesController } from './position_types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PositionType } from './entities/position_type.entity';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([PositionType]),CommonModule],
  controllers: [PositionTypesController],
  providers: [PositionTypesService],
})
export class PositionTypesModule {}
