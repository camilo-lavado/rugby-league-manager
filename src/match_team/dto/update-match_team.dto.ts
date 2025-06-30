import { PartialType } from '@nestjs/swagger';
import { CreateMatchTeamDto } from './create-match_team.dto';

export class UpdateMatchTeamDto extends PartialType(CreateMatchTeamDto) {}
