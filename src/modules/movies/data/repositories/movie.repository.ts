import { Movie } from '../../domain/movie.entity';

export interface MovieRepository {
  findAll(): Promise<Movie[]>;
  findById(id: number): Promise<Movie | null>;
}

export const MOVIE_REPOSITORY = Symbol('MOVIE_REPOSITORY');
