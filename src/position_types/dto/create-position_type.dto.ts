import { IsString } from 'class-validator';

export class CreatePositionTypeDto {
  @IsString()
  name: string;

  @IsString()
  type: string;
}
