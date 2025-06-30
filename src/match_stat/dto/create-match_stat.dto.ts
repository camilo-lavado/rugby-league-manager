import { IsInt, Min } from 'class-validator';

export class CreateMatchStatDto {
  @IsInt()
  fixtureId: number;

  @IsInt()
  teamId: number;

  @IsInt()
  @Min(0)
  possession: number;

  @IsInt()
  @Min(0)
  tackles: number;

  @IsInt()
  @Min(0)
  metersGained: number;

  @IsInt()
  @Min(0)
  penaltiesConceded: number;
}
