import { ApiProperty } from '@nestjs/swagger';
import { PlaceResponseDto } from './place-response.dto';

export class PaginatedPlacesResponseDto {
  @ApiProperty({ type: PlaceResponseDto, isArray: true })
  data!: PlaceResponseDto[];

  @ApiProperty()
  page!: number;

  @ApiProperty()
  limit!: number;

  @ApiProperty()
  total!: number;
}
