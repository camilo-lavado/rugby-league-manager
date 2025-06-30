import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchStatsService } from './match_stat.service';
import { MatchStatsController } from './match_stat.controller';
import { MatchStat } from './entities/match_stat.entity';
import { PaginationService } from '../common/services/pagination.service';

@Module({
  imports: [TypeOrmModule.forFeature([MatchStat])],
  controllers: [MatchStatsController],
  providers: [MatchStatsService, PaginationService],
})
export class MatchStatsModule {}
