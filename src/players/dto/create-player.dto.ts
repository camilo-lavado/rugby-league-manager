import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlayerDto {
  
  @ApiProperty({
    description: 'ID del usuario asociado al jugador',
    example: 123,
  })
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description: 'ID del equipo al que pertenece el jugador',
    example: 45,
  })
  @IsInt()
  @IsNotEmpty()
  teamId: number;

  @ApiProperty({
    description: 'ID de la posición que ocupa el jugador',
    example: 3,
  })
  @IsInt()
  @IsNotEmpty()
  positionId: number;

  @ApiProperty({
    description: 'Número de camiseta del jugador',
    example: 10,
  })
  @IsInt()
  @IsNotEmpty()
  jerseyNumber: number;
}
