import { NotFoundException } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieRepository } from '../../data/repositories/movie.repository';
import { Movie } from '../../domain/movie.entity';

describe('MovieService', () => {
  let service: MovieService;
  let repository: jest.Mocked<MovieRepository>;

  const movie: Movie = {
    id: 1,
    name: 'The Fellowship of the Ring',
    releaseYear: 2001,
    runtimeInMinutes: 178,
    budgetInMillions: 93,
    boxOfficeRevenueInMillions: 871.5,
    academyAwardNominations: 13,
    academyAwardWins: 4,
    rottenTomatoesScore: 91,
  };

  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
      findById: jest.fn(),
    };
    service = new MovieService(repository);
  });

  it('returns paginated movies from the repository', async () => {
    repository.findAll.mockResolvedValue([movie]);

    await expect(service.findAll({ page: 1, limit: 20 })).resolves.toEqual({
      data: [movie],
      page: 1,
      limit: 20,
      total: 1,
    });
  });

  it('returns a movie by id', async () => {
    repository.findById.mockResolvedValue(movie);

    await expect(service.findById(movie.id)).resolves.toEqual(movie);
  });

  it('throws NotFoundException when the movie does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.findById(999999)).rejects.toThrow(NotFoundException);
  });
});
