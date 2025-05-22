import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePositionTypeDto {
    @ApiProperty({
        description: 'Nombre del tipo de posición',
        example: 'Prop',
    })
    @IsNotEmpty()
    @IsString()
     name: string;
}