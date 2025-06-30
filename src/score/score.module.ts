import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScoresService } from './score.service';
import { ScoresController } from './score.controller';
import { Score } from './entities/score.entity';
import { PaginationService } from '../common/services/pagination.service';

@Module({
  imports: [TypeOrmModule.forFeature([Score])],
  controllers: [ScoresController],
  providers: [ScoresService, PaginationService],
})
export class ScoresModule {}
