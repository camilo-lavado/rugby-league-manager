import { IsInt, IsBoolean } from 'class-validator';

export class CreateMatchTeamDto {
  @IsInt()
  fixtureId: number;

  @IsInt()
  teamId: number;

  @IsBoolean()
  isHome: boolean;
}
