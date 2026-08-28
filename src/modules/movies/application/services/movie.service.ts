import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Movie } from '../../domain/movie.entity';
import {
  MOVIE_REPOSITORY,
  MovieRepository,
} from '../../data/repositories/movie.repository';
import { PaginatedResult } from '../../../../common/types/paginated-result.interface';
import { paginate } from '../../../../common/utils/paginate';

export interface FindMoviesQuery {
  page: number;
  limit: number;
  name?: string;
}

@Injectable()
export class MovieService {
  constructor(
    @Inject(MOVIE_REPOSITORY)
    private readonly movieRepository: MovieRepository,
  ) {}

  async findAll(query: FindMoviesQuery): Promise<PaginatedResult<Movie>> {
    const movies = await this.movieRepository.findAll();

    const filtered = query.name
      ? movies.filter((movie) =>
          movie.name.toLowerCase().includes(query.name!.toLowerCase()),
        )
      : movies;

    return paginate(filtered, query.page, query.limit);
  }

  async findById(id: number): Promise<Movie> {
    const movie = await this.movieRepository.findById(id);
    if (!movie) {
      throw new NotFoundException(`Movie with id "${id}" not found`);
    }
    return movie;
  }
}
