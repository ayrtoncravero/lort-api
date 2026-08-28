import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BookService } from '../../application/services/book.service';
import { FindBookByIdDto } from '../dto/find-book-by-id.dto';
import { FindBooksQueryDto } from '../dto/find-books-query.dto';
import { BookResponseDto } from '../dto/book-response.dto';
import { PaginatedBooksResponseDto } from '../dto/paginated-books-response.dto';
import { ApiErrorResponseDto } from '../../../../common/dto/api-error-response.dto';

@ApiTags('books')
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  @ApiOkResponse({ type: PaginatedBooksResponseDto })
  @ApiResponse({
    status: 400,
    description: 'Invalid query parameters',
    type: ApiErrorResponseDto,
  })
  findAll(
    @Query() query: FindBooksQueryDto,
  ): Promise<PaginatedBooksResponseDto> {
    return this.bookService.findAll(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({ type: BookResponseDto })
  @ApiResponse({
    status: 404,
    description: 'Book not found',
    type: ApiErrorResponseDto,
  })
  findById(@Param() params: FindBookByIdDto): Promise<BookResponseDto> {
    return this.bookService.findById(params.id);
  }
}
