import { PartialType } from '@nestjs/swagger';
import { CreateMatchStatDto } from './create-match_stat.dto';

export class UpdateMatchStatDto extends PartialType(CreateMatchStatDto) {}
