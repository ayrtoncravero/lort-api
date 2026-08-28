import { NotFoundException } from '@nestjs/common';
import { BookService } from './book.service';
import { BookRepository } from '../../data/repositories/book.repository';
import { Book } from '../../domain/book.entity';

describe('BookService', () => {
  let service: BookService;
  let repository: jest.Mocked<BookRepository>;

  const book: Book = {
    id: 1,
    name: 'The Fellowship of the Ring',
    author: 'J.R.R. Tolkien',
    releaseYear: 1954,
  };

  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
      findById: jest.fn(),
    };
    service = new BookService(repository);
  });

  it('returns paginated books from the repository', async () => {
    repository.findAll.mockResolvedValue([book]);

    await expect(service.findAll({ page: 1, limit: 20 })).resolves.toEqual({
      data: [book],
      page: 1,
      limit: 20,
      total: 1,
    });
  });

  it('returns a book by id', async () => {
    repository.findById.mockResolvedValue(book);

    await expect(service.findById(book.id)).resolves.toEqual(book);
  });

  it('throws NotFoundException when the book does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.findById(999999)).rejects.toThrow(NotFoundException);
  });
});
