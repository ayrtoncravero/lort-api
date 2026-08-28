import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlaceService } from '../../application/services/place.service';
import { FindPlaceByIdDto } from '../dto/find-place-by-id.dto';
import { FindPlacesQueryDto } from '../dto/find-places-query.dto';
import { PlaceResponseDto } from '../dto/place-response.dto';
import { PaginatedPlacesResponseDto } from '../dto/paginated-places-response.dto';
import { ApiErrorResponseDto } from '../../../../common/dto/api-error-response.dto';

@ApiTags('places')
@Controller('places')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @Get()
  @ApiOkResponse({ type: PaginatedPlacesResponseDto })
  @ApiResponse({
    status: 400,
    description: 'Invalid query parameters',
    type: ApiErrorResponseDto,
  })
  findAll(
    @Query() query: FindPlacesQueryDto,
  ): Promise<PaginatedPlacesResponseDto> {
    return this.placeService.findAll(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({ type: PlaceResponseDto })
  @ApiResponse({
    status: 404,
    description: 'Place not found',
    type: ApiErrorResponseDto,
  })
  findById(@Param() params: FindPlaceByIdDto): Promise<PlaceResponseDto> {
    return this.placeService.findById(params.id);
  }
}
