import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DivisionsService } from './divisions.service';
import { DivisionsController } from './divisions.controller';
import { Division } from './entities/division.entity';
import { PaginationService } from '../common/services/pagination.service';

@Module({
  imports: [TypeOrmModule.forFeature([Division])],
  controllers: [DivisionsController],
  providers: [DivisionsService, PaginationService],
})
export class DivisionsModule {}
