import { IsInt, Min } from 'class-validator';

export class CreatePlayerSeasonStatDto {
  @IsInt()
  playerId: number;

  @IsInt()
  seasonId: number;

  @IsInt()
  @Min(0)
  matchesPlayed: number;

  @IsInt()
  @Min(0)
  tries: number;

  @IsInt()
  @Min(0)
  points: number;
}
