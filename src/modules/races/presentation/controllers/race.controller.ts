import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RaceService } from '../../application/services/race.service';
import { FindRaceByIdDto } from '../dto/find-race-by-id.dto';
import { FindRacesQueryDto } from '../dto/find-races-query.dto';
import { RaceResponseDto } from '../dto/race-response.dto';
import { PaginatedRacesResponseDto } from '../dto/paginated-races-response.dto';
import { ApiErrorResponseDto } from '../../../../common/dto/api-error-response.dto';

@ApiTags('races')
@Controller('races')
export class RaceController {
  constructor(private readonly raceService: RaceService) {}

  @Get()
  @ApiOkResponse({ type: PaginatedRacesResponseDto })
  @ApiResponse({
    status: 400,
    description: 'Invalid query parameters',
    type: ApiErrorResponseDto,
  })
  findAll(
    @Query() query: FindRacesQueryDto,
  ): Promise<PaginatedRacesResponseDto> {
    return this.raceService.findAll(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({ type: RaceResponseDto })
  @ApiResponse({
    status: 404,
    description: 'Race not found',
    type: ApiErrorResponseDto,
  })
  findById(@Param() params: FindRaceByIdDto): Promise<RaceResponseDto> {
    return this.raceService.findById(params.id);
  }
}
