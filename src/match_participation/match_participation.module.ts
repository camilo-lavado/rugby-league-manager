import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchParticipation } from './entities/match_participation.entity';
import { MatchParticipationService } from './match_participation.service';
import { MatchParticipationController } from './match_participation.controller';
import { PaginationService } from '../common/services/pagination.service';

@Module({
  imports: [TypeOrmModule.forFeature([MatchParticipation])],
  controllers: [MatchParticipationController],
  providers: [MatchParticipationService, PaginationService],
})
export class MatchParticipationModule {}
