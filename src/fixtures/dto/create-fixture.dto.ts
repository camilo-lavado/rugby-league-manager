import { IsDateString, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateFixtureDto {
  @IsInt()
  leagueId: number;

  @IsInt()
  stadiumId: number;

  @IsInt()
  seasonId: number;

  @IsInt()
  refereeId: number;

  @IsDateString()
  matchDate: Date;

  @IsString()
  status: string;

  @IsString()
  phase: string;
}
