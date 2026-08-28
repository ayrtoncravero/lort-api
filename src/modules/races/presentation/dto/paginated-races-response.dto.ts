import { ApiProperty } from '@nestjs/swagger';
import { RaceResponseDto } from './race-response.dto';

export class PaginatedRacesResponseDto {
  @ApiProperty({ type: RaceResponseDto, isArray: true })
  data!: RaceResponseDto[];

  @ApiProperty()
  page!: number;

  @ApiProperty()
  limit!: number;

  @ApiProperty()
  total!: number;
}
