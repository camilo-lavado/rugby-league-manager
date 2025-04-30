// src/database/seeders/seeder.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersSeederModule } from './users/users-seeder.module';
import { LeaguesSeederModule } from './leagues/leagues-seeder.module';
import { SeederService } from './seeder.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersSeederModule,
    LeaguesSeederModule,
  ],
  providers: [SeederService],
})
export class SeederModule {}