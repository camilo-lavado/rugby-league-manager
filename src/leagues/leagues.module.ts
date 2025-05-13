import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaguesService } from './leagues.service';
import { LeaguesController } from './leagues.controller';
import { League } from './league.entity';
import { CommonModule } from '../common/common.module';
import { Team } from '../teams/entities/team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([League, Team]),
    CommonModule,
  ],
  providers: [LeaguesService],
  controllers: [LeaguesController],
})
export class LeaguesModule {}
