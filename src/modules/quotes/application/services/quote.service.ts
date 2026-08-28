import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Quote } from '../../domain/quote.entity';
import { QuoteWithRelations } from '../../domain/quote-with-relations.entity';
import {
  QUOTE_REPOSITORY,
  QuoteRepository,
} from '../../data/repositories/quote.repository';
import {
  CHARACTER_REPOSITORY,
  CharacterRepository,
} from '../../../characters/data/repositories/character.repository';
import {
  MOVIE_REPOSITORY,
  MovieRepository,
} from '../../../movies/data/repositories/movie.repository';
import { PaginatedResult } from '../../../../common/types/paginated-result.interface';
import { paginate } from '../../../../common/utils/paginate';

export interface FindQuotesQuery {
  page: number;
  limit: number;
  movieId?: number;
  characterId?: number;
}

@Injectable()
export class QuoteService {
  constructor(
    @Inject(QUOTE_REPOSITORY)
    private readonly quoteRepository: QuoteRepository,
    @Inject(CHARACTER_REPOSITORY)
    private readonly characterRepository: CharacterRepository,
    @Inject(MOVIE_REPOSITORY)
    private readonly movieRepository: MovieRepository,
  ) {}

  async findAll(
    query: FindQuotesQuery,
  ): Promise<PaginatedResult<QuoteWithRelations>> {
    const quotes = await this.quoteRepository.findAll();

    const filtered = quotes.filter((quote) => {
      const matchesMovie = query.movieId
        ? quote.movieId === query.movieId
        : true;
      const matchesCharacter = query.characterId
        ? quote.characterId === query.characterId
        : true;
      return matchesMovie && matchesCharacter;
    });

    const page = paginate(filtered, query.page, query.limit);
    const data = await Promise.all(
      page.data.map((quote) => this.enrich(quote)),
    );

    return { ...page, data };
  }

  async findById(id: number): Promise<QuoteWithRelations> {
    const quote = await this.quoteRepository.findById(id);
    if (!quote) {
      throw new NotFoundException(`Quote with id "${id}" not found`);
    }
    return this.enrich(quote);
  }

  private async enrich(quote: Quote): Promise<QuoteWithRelations> {
    const [character, movie] = await Promise.all([
      quote.characterId !== null
        ? this.characterRepository.findById(quote.characterId)
        : null,
      quote.movieId !== null
        ? this.movieRepository.findById(quote.movieId)
        : null,
    ]);

    return {
      id: quote.id,
      dialog: quote.dialog,
      character: character ? { id: character.id, name: character.name } : null,
      movie: movie ? { id: movie.id, name: movie.name } : null,
    };
  }
}
