import { IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryMatchParticipationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  fixtureId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  playerId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number = 10;
}
