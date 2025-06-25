import { IsOptional, IsString } from 'class-validator';
import { QueryPaginationDto } from '../../common/dto/query-pagination.dto';

export class QuerySeasonDto extends QueryPaginationDto {
  @IsOptional()
  @IsString()
  name?: string;
}
