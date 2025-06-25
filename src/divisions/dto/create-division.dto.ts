import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateDivisionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}
