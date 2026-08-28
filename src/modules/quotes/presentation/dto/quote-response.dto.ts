import { ApiProperty } from '@nestjs/swagger';

class QuoteRelationSummaryDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty()
  name!: string;
}

export class QuoteResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty()
  dialog!: string;

  @ApiProperty({ type: QuoteRelationSummaryDto, nullable: true })
  character!: QuoteRelationSummaryDto | null;

  @ApiProperty({ type: QuoteRelationSummaryDto, nullable: true })
  movie!: QuoteRelationSummaryDto | null;
}
