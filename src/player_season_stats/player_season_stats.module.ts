import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerSeasonStatsService } from './player_season_stats.service';
import { PlayerSeasonStatsController } from './player_season_stats.controller';
import { PlayerSeasonStat } from './entities/player_season_stat.entity';
import { PaginationService } from '../common/services/pagination.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlayerSeasonStat])],
  controllers: [PlayerSeasonStatsController],
  providers: [PlayerSeasonStatsService, PaginationService],
})
export class PlayerSeasonStatsModule {}
