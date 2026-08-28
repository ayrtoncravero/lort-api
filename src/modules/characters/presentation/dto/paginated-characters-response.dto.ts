import { ApiProperty } from '@nestjs/swagger';
import { CharacterResponseDto } from './character-response.dto';

export class PaginatedCharactersResponseDto {
  @ApiProperty({ type: CharacterResponseDto, isArray: true })
  data!: CharacterResponseDto[];

  @ApiProperty()
  page!: number;

  @ApiProperty()
  limit!: number;

  @ApiProperty()
  total!: number;
}
