import { Book } from '../../domain/book.entity';

export interface BookRepository {
  findAll(): Promise<Book[]>;
  findById(id: number): Promise<Book | null>;
}

export const BOOK_REPOSITORY = Symbol('BOOK_REPOSITORY');
