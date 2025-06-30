import { PartialType } from '@nestjs/swagger';
import { CreateMatchAggregateDto } from './create-match_aggregate.dto';

export class UpdateMatchAggregateDto extends PartialType(CreateMatchAggregateDto) {}
