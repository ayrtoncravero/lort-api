import { Injectable } from '@nestjs/common';
import { JsonDataLoader } from '../../../../infrastructure/json/json-data-loader';
import { Movie } from '../../domain/movie.entity';
import { MovieRepository } from './movie.repository';

@Injectable()
export class JsonMovieRepository implements MovieRepository {
  constructor(private readonly jsonDataLoader: JsonDataLoader) {}

  async findAll(): Promise<Movie[]> {
    return this.jsonDataLoader.load<Movie[]>('movies.json');
  }

  async findById(id: number): Promise<Movie | null> {
    const movies = await this.findAll();
    return movies.find((movie) => movie.id === id) ?? null;
  }
}
