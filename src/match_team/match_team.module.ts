import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchTeamsService } from './match_team.service';
import { MatchTeamsController } from './match_team.controller';
import { MatchTeam } from './entities/match_team.entity';
import { PaginationService } from '../common/services/pagination.service';

@Module({
  imports: [TypeOrmModule.forFeature([MatchTeam])],
  controllers: [MatchTeamsController],
  providers: [MatchTeamsService, PaginationService],
})
export class MatchTeamsModule {}
