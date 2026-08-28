import { Module } from '@nestjs/common';
import { BookController } from './presentation/controllers/book.controller';
import { BookService } from './application/services/book.service';
import { BOOK_REPOSITORY } from './data/repositories/book.repository';
import { JsonBookRepository } from './data/repositories/json-book.repository';

@Module({
  controllers: [BookController],
  providers: [
    BookService,
    { provide: BOOK_REPOSITORY, useClass: JsonBookRepository },
  ],
  exports: [BOOK_REPOSITORY],
})
export class BooksModule {}
