import { IsInt, Min, IsBoolean } from 'class-validator';

export class CreateMatchParticipationDto {
  @IsInt()
  fixtureId: number;

  @IsInt()
  playerId: number;

  @IsInt()
  @Min(0)
  minutesPlayed: number;

  @IsBoolean()
  isStarting: boolean;
}
