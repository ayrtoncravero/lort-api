import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { PaginationQueryDto } from '../../../../common/dto/pagination-query.dto';

export class FindQuotesQueryDto extends PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  movieId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  characterId?: number;
}
