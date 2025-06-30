import { PartialType } from '@nestjs/swagger';
import { CreatePlayerSeasonStatDto } from './create-player_season_stat.dto';

export class UpdatePlayerSeasonStatDto extends PartialType(CreatePlayerSeasonStatDto) {}
