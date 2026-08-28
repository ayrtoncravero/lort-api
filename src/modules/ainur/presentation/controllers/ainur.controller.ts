import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AinurService } from '../../application/services/ainur.service';
import { FindAinurByIdDto } from '../dto/find-ainur-by-id.dto';
import { FindAinurQueryDto } from '../dto/find-ainur-query.dto';
import { AinurResponseDto } from '../dto/ainur-response.dto';
import { PaginatedAinurResponseDto } from '../dto/paginated-ainur-response.dto';
import { ApiErrorResponseDto } from '../../../../common/dto/api-error-response.dto';

@ApiTags('ainur')
@Controller('ainur')
export class AinurController {
  constructor(private readonly ainurService: AinurService) {}

  @Get()
  @ApiOkResponse({ type: PaginatedAinurResponseDto })
  @ApiResponse({
    status: 400,
    description: 'Invalid query parameters',
    type: ApiErrorResponseDto,
  })
  findAll(
    @Query() query: FindAinurQueryDto,
  ): Promise<PaginatedAinurResponseDto> {
    return this.ainurService.findAll(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({ type: AinurResponseDto })
  @ApiResponse({
    status: 404,
    description: 'Ainur not found',
    type: ApiErrorResponseDto,
  })
  findById(@Param() params: FindAinurByIdDto): Promise<AinurResponseDto> {
    return this.ainurService.findById(params.id);
  }
}
