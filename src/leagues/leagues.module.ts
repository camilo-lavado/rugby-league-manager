import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaguesService } from './leagues.service';
import { LeaguesController } from './leagues.controller';
import { League } from './league.entity';

@Module({
  imports: [TypeOrmModule.forFeature([League])],
  providers: [LeaguesService],
  controllers: [LeaguesController],
})
export class LeaguesModule {}
