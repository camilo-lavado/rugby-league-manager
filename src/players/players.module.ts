import { Module } from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayersController } from './players.controller';
import { Player } from './entities/player.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
      TypeOrmModule.forFeature([Player]),
      CommonModule,
    ],
  controllers: [PlayersController],
  providers: [PlayersService],
})
export class PlayersModule {}
