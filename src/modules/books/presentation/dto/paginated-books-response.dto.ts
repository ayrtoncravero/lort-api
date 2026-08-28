import { ApiProperty } from '@nestjs/swagger';
import { BookResponseDto } from './book-response.dto';

export class PaginatedBooksResponseDto {
  @ApiProperty({ type: BookResponseDto, isArray: true })
  data!: BookResponseDto[];

  @ApiProperty()
  page!: number;

  @ApiProperty()
  limit!: number;

  @ApiProperty()
  total!: number;
}
