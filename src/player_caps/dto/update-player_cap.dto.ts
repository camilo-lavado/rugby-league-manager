import { PartialType } from '@nestjs/swagger';
import { CreatePlayerCapDto } from './create-player_cap.dto';

export class UpdatePlayerCapDto extends PartialType(CreatePlayerCapDto) {}
