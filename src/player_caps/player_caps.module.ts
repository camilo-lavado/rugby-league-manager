import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerCapsService } from './player_caps.service';
import { PlayerCapsController } from './player_caps.controller';
import { PlayerCap } from './entities/player_cap.entity';
import { PaginationService } from '../common/services/pagination.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlayerCap])],
  controllers: [PlayerCapsController],
  providers: [PlayerCapsService, PaginationService],
})
export class PlayerCapsModule {}
