// src/database/seeders/leagues/leagues-seeder.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { League } from '../../../leagues/league.entity';
import { User } from '../../../users/entities/user.entity';
import { LeaguesSeederService } from './leagues-seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([League, User])],
  providers: [LeaguesSeederService],
  exports: [LeaguesSeederService],
})
export class LeaguesSeederModule {}