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
import { PositionsModule } from './positions/positions.module';
import { PositionTypesModule } from './position_types/position_types.module';
import { CategoriesModule } from './categories/categories.module';

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
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true, // Solo para desarrollo
    }),
    LeaguesModule,
    AuthModule,
    UsersModule,
    CommonModule,
    TestModule,
    TeamsModule,
    PlayersModule,
    PositionsModule,
    PositionTypesModule,
    CategoriesModule,
  ],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
