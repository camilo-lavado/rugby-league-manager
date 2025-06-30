import { PartialType } from '@nestjs/swagger';
import { CreateMatchParticipationDto } from './create-match_participation.dto';

export class UpdateMatchParticipationDto extends PartialType(CreateMatchParticipationDto) {}
