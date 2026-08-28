import { ApiProperty } from '@nestjs/swagger';
import { QuoteResponseDto } from './quote-response.dto';

export class PaginatedQuotesResponseDto {
  @ApiProperty({ type: QuoteResponseDto, isArray: true })
  data!: QuoteResponseDto[];

  @ApiProperty()
  page!: number;

  @ApiProperty()
  limit!: number;

  @ApiProperty()
  total!: number;
}
