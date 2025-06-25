import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateStandingDto {
  @IsInt()
  @IsNotEmpty()
  leagueId: number;

  @IsInt()
  @IsNotEmpty()
  teamId: number;

  @IsInt()
  @Min(0)
  played: number;

  @IsInt()
  @Min(0)
  won: number;

  @IsInt()
  @Min(0)
  drawn: number;

  @IsInt()
  @Min(0)
  lost: number;

  @IsInt()
  @Min(0)
  points: number;

  @IsInt()
  @Min(0)
  tries: number;

  @IsInt()
  @Min(0)
  received: number;
}
