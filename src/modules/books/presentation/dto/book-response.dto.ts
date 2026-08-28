import { ApiProperty } from '@nestjs/swagger';

export class BookResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  author!: string;

  @ApiProperty()
  releaseYear!: number;
}
