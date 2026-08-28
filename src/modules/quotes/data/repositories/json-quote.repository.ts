import { Injectable } from '@nestjs/common';
import { JsonDataLoader } from '../../../../infrastructure/json/json-data-loader';
import { Quote } from '../../domain/quote.entity';
import { QuoteRepository } from './quote.repository';

@Injectable()
export class JsonQuoteRepository implements QuoteRepository {
  constructor(private readonly jsonDataLoader: JsonDataLoader) {}

  async findAll(): Promise<Quote[]> {
    return this.jsonDataLoader.load<Quote[]>('quotes.json');
  }

  async findById(id: number): Promise<Quote | null> {
    const quotes = await this.findAll();
    return quotes.find((quote) => quote.id === id) ?? null;
  }
}
