/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLeagueDto {
  @ApiProperty({
    description: 'The name of the league',
    example: 'Premier League',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The country where the league is based',
    example: 'England',
  })
  @IsString()
  @IsNotEmpty()
  country: string;
}
