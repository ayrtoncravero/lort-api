import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Book } from '../../domain/book.entity';
import {
  BOOK_REPOSITORY,
  BookRepository,
} from '../../data/repositories/book.repository';
import { PaginatedResult } from '../../../../common/types/paginated-result.interface';
import { paginate } from '../../../../common/utils/paginate';

export interface FindBooksQuery {
  page: number;
  limit: number;
  name?: string;
}

@Injectable()
export class BookService {
  constructor(
    @Inject(BOOK_REPOSITORY)
    private readonly bookRepository: BookRepository,
  ) {}

  async findAll(query: FindBooksQuery): Promise<PaginatedResult<Book>> {
    const books = await this.bookRepository.findAll();

    const filtered = query.name
      ? books.filter((book) =>
          book.name.toLowerCase().includes(query.name!.toLowerCase()),
        )
      : books;

    return paginate(filtered, query.page, query.limit);
  }

  async findById(id: number): Promise<Book> {
    const book = await this.bookRepository.findById(id);
    if (!book) {
      throw new NotFoundException(`Book with id "${id}" not found`);
    }
    return book;
  }
}
