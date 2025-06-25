import { IsOptional, IsString, IsNumberString } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryStadiumDto {
  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  location?: string;
}
