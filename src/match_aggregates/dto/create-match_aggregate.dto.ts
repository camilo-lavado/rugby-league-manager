import { IsInt, Min } from 'class-validator';

export class CreateMatchAggregateDto {
  @IsInt()
  fixtureId: number;

  @IsInt()
  @Min(0)
  totalPoints: number;

  @IsInt()
  @Min(0)
  totalTries: number;

  @IsInt()
  @Min(0)
  totalPenalties: number;

  @IsInt()
  @Min(0)
  totalMeters: number;
}
