import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Season } from './entities/season.entity';
import { SeasonsService } from './seasons.service';
import { SeasonsController } from './seasons.controller';
import { PaginationService } from '../common/services/pagination.service'; 

@Module({
  imports: [TypeOrmModule.forFeature([Season])],
  controllers: [SeasonsController],
  providers: [SeasonsService, PaginationService],
})
export class SeasonsModule {}
