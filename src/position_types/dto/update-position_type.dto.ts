import { PartialType } from '@nestjs/swagger';
import { CreatePositionTypeDto } from './create-position_type.dto';

export class UpdatePositionTypeDto extends PartialType(CreatePositionTypeDto) {}
