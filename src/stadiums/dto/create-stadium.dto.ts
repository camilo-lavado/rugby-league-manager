import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateStadiumDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsNumber()
  @IsNotEmpty()
  capacity: number;

  @IsString()
  @IsNotEmpty()
  surfaceType: string;

  @IsOptional()
  @IsString()
  status?: string;
}
