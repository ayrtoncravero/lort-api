import { ApiProperty } from '@nestjs/swagger';

export class PlaceResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  type!: string;

  @ApiProperty({ nullable: true, example: null })
  parentId!: number | null;

  @ApiProperty({ nullable: true, example: null })
  wikiUrl!: string | null;
}
