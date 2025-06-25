import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StandingsService } from './standings.service';
import { StandingsController } from './standings.controller';
import { Standing } from './entities/standing.entity';
import { PaginationService } from '../common/services/pagination.service';

@Module({
  imports: [TypeOrmModule.forFeature([Standing])],
  controllers: [StandingsController],
  providers: [StandingsService, PaginationService],
})
export class StandingsModule {}
