import { IsInt, Min } from 'class-validator';

export class CreatePlayerCapDto {
  @IsInt()
  playerId: number;

  @IsInt()
  fixtureId: number;

  @IsInt()
  @Min(1)
  caps: number;
}
