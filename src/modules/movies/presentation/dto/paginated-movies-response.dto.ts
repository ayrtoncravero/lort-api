import { ApiProperty } from '@nestjs/swagger';
import { MovieResponseDto } from './movie-response.dto';

export class PaginatedMoviesResponseDto {
  @ApiProperty({ type: MovieResponseDto, isArray: true })
  data!: MovieResponseDto[];

  @ApiProperty()
  page!: number;

  @ApiProperty()
  limit!: number;

  @ApiProperty()
  total!: number;
}
