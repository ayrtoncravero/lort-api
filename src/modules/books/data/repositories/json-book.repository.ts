import { Injectable } from '@nestjs/common';
import { JsonDataLoader } from '../../../../infrastructure/json/json-data-loader';
import { Book } from '../../domain/book.entity';
import { BookRepository } from './book.repository';

@Injectable()
export class JsonBookRepository implements BookRepository {
  constructor(private readonly jsonDataLoader: JsonDataLoader) {}

  async findAll(): Promise<Book[]> {
    return this.jsonDataLoader.load<Book[]>('books.json');
  }

  async findById(id: number): Promise<Book | null> {
    const books = await this.findAll();
    return books.find((book) => book.id === id) ?? null;
  }
}
