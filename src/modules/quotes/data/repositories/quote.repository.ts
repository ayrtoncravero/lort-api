import { Quote } from '../../domain/quote.entity';

export interface QuoteRepository {
  findAll(): Promise<Quote[]>;
  findById(id: number): Promise<Quote | null>;
}

export const QUOTE_REPOSITORY = Symbol('QUOTE_REPOSITORY');
