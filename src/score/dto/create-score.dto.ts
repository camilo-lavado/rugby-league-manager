import { IsInt, Min } from 'class-validator';

export class CreateScoreDto {
  @IsInt()
  fixtureId: number;

  @IsInt()
  teamId: number;

  @IsInt()
  @Min(0)
  tries: number;

  @IsInt()
  @Min(0)
  conversions: number;

  @IsInt()
  @Min(0)
  penalties: number;

  @IsInt()
  @Min(0)
  dropGoals: number;

  @IsInt()
  @Min(0)
  totalPoints: number;
}
