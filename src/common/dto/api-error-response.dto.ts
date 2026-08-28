import { ApiProperty } from '@nestjs/swagger';

export class ApiErrorResponseDto {
  @ApiProperty({ example: 404 })
  statusCode!: number;

  @ApiProperty({
    type: [String],
    example: ['Character with id "999999" not found'],
  })
  message!: string[];

  @ApiProperty({ example: 'Not Found' })
  error!: string;

  @ApiProperty({ example: '/api/characters/999999' })
  path!: string;

  @ApiProperty({ example: '2026-08-28T01:41:43.059Z' })
  timestamp!: string;
}
