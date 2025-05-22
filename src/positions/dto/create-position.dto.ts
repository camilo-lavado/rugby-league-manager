import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePositionDto {

  @ApiProperty({
    description: 'Nombre de la posición',
    example: 'FullBack',
    required: true,
  })  
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  typeId: number;
}