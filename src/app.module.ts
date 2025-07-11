import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { LeaguesModule } from './leagues/leagues.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TestModule } from './test/test.module';
import { TeamsModule } from './teams/teams.module';
import { PlayersModule } from './players/players.module';
//import { PositionsModule } from './positions/positions.module';
//import { PositionTypesModule } from './position_types/position_types.module';
import { CategoriesModule } from './categories/categories.module';
import { PositionsModule } from './positions/positions.module';
import { PositionTypesModule } from './position_types/position_types.module';
import { StadiumsModule } from './stadiums/stadiums.module';
import { SeasonsModule } from './seasons/seasons.module';
import { DivisionsModule } from './divisions/divisions.module';
import { StandingsModule } from './standings/standings.module';
import { FixturesModule } from './fixtures/fixtures.module';
import { MatchTeamsModule } from './match_team/match_team.module';
import { MatchParticipationModule } from './match_participation/match_participation.module';
import { ScoresModule } from './score/score.module';
import { MatchStatsModule } from './match_stat/match_stat.module';
import { PlayerCapsModule } from './player_caps/player_caps.module';
import { PlayerSeasonStatsModule } from './player_season_stats/player_season_stats.module';
import { MatchAggregatesModule } from './match_aggregates/match_aggregates.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    /*TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true, // Solo para desarrollo
    }),*/
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true, // ⚠️ No usar en producción sin precaución
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    
    LeaguesModule,
    AuthModule,
    UsersModule,
    CommonModule,
    TestModule,
    TeamsModule,
    PlayersModule,
    //PositionsModule,
    //PositionTypesModule,
    CategoriesModule,
    PositionsModule,
    PositionTypesModule,
    StadiumsModule,
    SeasonsModule,
    DivisionsModule,
    StandingsModule,
    FixturesModule,
    MatchTeamsModule,
    MatchParticipationModule,
    ScoresModule,
    MatchStatsModule,
    PlayerCapsModule,
    PlayerSeasonStatsModule,
    MatchAggregatesModule,
  ],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
