import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stadium } from './entities/stadium.entity';
import { StadiumsService } from './stadiums.service';
import { StadiumsController } from './stadiums.controller';
import { PaginationService } from '../common/services/pagination.service';

@Module({
  imports: [TypeOrmModule.forFeature([Stadium])],
  controllers: [StadiumsController],
  providers: [StadiumsService, PaginationService],
})
export class StadiumsModule {}
