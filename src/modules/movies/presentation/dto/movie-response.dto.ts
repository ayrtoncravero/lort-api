import { ApiProperty } from '@nestjs/swagger';

export class MovieResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  releaseYear!: number;

  @ApiProperty()
  runtimeInMinutes!: number;

  @ApiProperty({ description: 'Budget in millions of USD' })
  budgetInMillions!: number;

  @ApiProperty({ description: 'Box office revenue in millions of USD' })
  boxOfficeRevenueInMillions!: number;

  @ApiProperty()
  academyAwardNominations!: number;

  @ApiProperty()
  academyAwardWins!: number;

  @ApiProperty()
  rottenTomatoesScore!: number;
}
