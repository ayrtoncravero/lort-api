import { ApiProperty } from '@nestjs/swagger';
import { AinurResponseDto } from './ainur-response.dto';

export class PaginatedAinurResponseDto {
  @ApiProperty({ type: AinurResponseDto, isArray: true })
  data!: AinurResponseDto[];

  @ApiProperty()
  page!: number;

  @ApiProperty()
  limit!: number;

  @ApiProperty()
  total!: number;
}
