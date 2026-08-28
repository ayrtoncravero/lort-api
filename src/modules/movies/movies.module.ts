import { Module } from '@nestjs/common';
import { MovieController } from './presentation/controllers/movie.controller';
import { MovieService } from './application/services/movie.service';
import { MOVIE_REPOSITORY } from './data/repositories/movie.repository';
import { JsonMovieRepository } from './data/repositories/json-movie.repository';

@Module({
  controllers: [MovieController],
  providers: [
    MovieService,
    { provide: MOVIE_REPOSITORY, useClass: JsonMovieRepository },
  ],
  exports: [MOVIE_REPOSITORY],
})
export class MoviesModule {}
