import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MovieService } from '../../application/services/movie.service';
import { FindMovieByIdDto } from '../dto/find-movie-by-id.dto';
import { FindMoviesQueryDto } from '../dto/find-movies-query.dto';
import { MovieResponseDto } from '../dto/movie-response.dto';
import { PaginatedMoviesResponseDto } from '../dto/paginated-movies-response.dto';
import { ApiErrorResponseDto } from '../../../../common/dto/api-error-response.dto';

@ApiTags('movies')
@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  @ApiOkResponse({ type: PaginatedMoviesResponseDto })
  @ApiResponse({
    status: 400,
    description: 'Invalid query parameters',
    type: ApiErrorResponseDto,
  })
  findAll(
    @Query() query: FindMoviesQueryDto,
  ): Promise<PaginatedMoviesResponseDto> {
    return this.movieService.findAll(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({ type: MovieResponseDto })
  @ApiResponse({
    status: 404,
    description: 'Movie not found',
    type: ApiErrorResponseDto,
  })
  findById(@Param() params: FindMovieByIdDto): Promise<MovieResponseDto> {
    return this.movieService.findById(params.id);
  }
}
