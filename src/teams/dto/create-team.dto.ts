import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateTeamDto {

    @ApiProperty({
        description: 'The name of the team',
        example: 'Manchester United',
    })
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @ApiProperty({
        description: 'The country where the team is based',
        example: 'England',
    })
    @IsString()
    @IsNotEmpty()
    country: string;
    
    @ApiProperty({
        description: 'The league ID to which the team belongs',
        example: 1,
    })


    @ApiProperty({
        description: 'The URL of the team logo',
        example: 'https://example.com/logo.png',
    })
    @IsString()
    logoUrl: string;
    
    @IsNotEmpty()
    leagueId: number;   
}
