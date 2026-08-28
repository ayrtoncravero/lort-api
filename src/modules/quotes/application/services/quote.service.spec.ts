import { NotFoundException } from '@nestjs/common';
import { QuoteService } from './quote.service';
import { QuoteRepository } from '../../data/repositories/quote.repository';
import { Quote } from '../../domain/quote.entity';
import { CharacterRepository } from '../../../characters/data/repositories/character.repository';
import { MovieRepository } from '../../../movies/data/repositories/movie.repository';
import { Character } from '../../../characters/domain/character.entity';
import { Movie } from '../../../movies/domain/movie.entity';

describe('QuoteService', () => {
  let service: QuoteService;
  let quoteRepository: jest.Mocked<QuoteRepository>;
  let characterRepository: jest.Mocked<CharacterRepository>;
  let movieRepository: jest.Mocked<MovieRepository>;

  const quote: Quote = {
    id: 1,
    dialog: 'You shall not pass!',
    movieId: 1,
    characterId: 2,
  };

  const character: Character = {
    id: 2,
    name: 'Gandalf',
    race: 'Maia',
    gender: 'Male',
    birth: null,
    death: null,
    hair: null,
    height: null,
    realm: null,
    spouse: null,
    wikiUrl: null,
  };

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
    quoteRepository = { findAll: jest.fn(), findById: jest.fn() };
    characterRepository = { findAll: jest.fn(), findById: jest.fn() };
    movieRepository = { findAll: jest.fn(), findById: jest.fn() };
    service = new QuoteService(
      quoteRepository,
      characterRepository,
      movieRepository,
    );
  });

  it('returns paginated quotes enriched with character and movie', async () => {
    quoteRepository.findAll.mockResolvedValue([quote]);
    characterRepository.findById.mockResolvedValue(character);
    movieRepository.findById.mockResolvedValue(movie);

    await expect(service.findAll({ page: 1, limit: 20 })).resolves.toEqual({
      data: [
        {
          id: 1,
          dialog: 'You shall not pass!',
          character: { id: 2, name: 'Gandalf' },
          movie: {
            id: 1,
            name: 'The Fellowship of the Ring',
          },
        },
      ],
      page: 1,
      limit: 20,
      total: 1,
    });
  });

  it('returns a quote by id enriched with relations', async () => {
    quoteRepository.findById.mockResolvedValue(quote);
    characterRepository.findById.mockResolvedValue(character);
    movieRepository.findById.mockResolvedValue(movie);

    await expect(service.findById(quote.id)).resolves.toEqual({
      id: 1,
      dialog: 'You shall not pass!',
      character: { id: 2, name: 'Gandalf' },
      movie: {
        id: 1,
        name: 'The Fellowship of the Ring',
      },
    });
  });

  it('returns null relations when character or movie is missing', async () => {
    quoteRepository.findById.mockResolvedValue(quote);
    characterRepository.findById.mockResolvedValue(null);
    movieRepository.findById.mockResolvedValue(null);

    await expect(service.findById(quote.id)).resolves.toEqual({
      id: 1,
      dialog: 'You shall not pass!',
      character: null,
      movie: null,
    });
  });

  it('returns null relations when characterId/movieId are null', async () => {
    const orphanQuote: Quote = {
      id: 9,
      dialog: 'Narration line.',
      movieId: null,
      characterId: null,
    };
    quoteRepository.findById.mockResolvedValue(orphanQuote);

    await expect(service.findById(orphanQuote.id)).resolves.toEqual({
      id: 9,
      dialog: 'Narration line.',
      character: null,
      movie: null,
    });
    expect(characterRepository.findById).not.toHaveBeenCalled();
    expect(movieRepository.findById).not.toHaveBeenCalled();
  });

  it('throws NotFoundException when the quote does not exist', async () => {
    quoteRepository.findById.mockResolvedValue(null);

    await expect(service.findById(999999)).rejects.toThrow(NotFoundException);
  });
});
