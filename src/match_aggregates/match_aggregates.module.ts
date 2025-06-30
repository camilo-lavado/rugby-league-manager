import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchAggregatesService } from './match_aggregates.service';
import { MatchAggregatesController } from './match_aggregates.controller';
import { MatchAggregate } from './entities/match_aggregate.entity';
import { PaginationService } from '../common/services/pagination.service';

@Module({
  imports: [TypeOrmModule.forFeature([MatchAggregate])],
  controllers: [MatchAggregatesController],
  providers: [MatchAggregatesService, PaginationService],
})
export class MatchAggregatesModule {}
