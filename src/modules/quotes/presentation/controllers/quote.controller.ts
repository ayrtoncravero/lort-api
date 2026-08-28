import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QuoteService } from '../../application/services/quote.service';
import { FindQuoteByIdDto } from '../dto/find-quote-by-id.dto';
import { FindQuotesQueryDto } from '../dto/find-quotes-query.dto';
import { QuoteResponseDto } from '../dto/quote-response.dto';
import { PaginatedQuotesResponseDto } from '../dto/paginated-quotes-response.dto';
import { ApiErrorResponseDto } from '../../../../common/dto/api-error-response.dto';

@ApiTags('quotes')
@Controller('quotes')
export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}

  @Get()
  @ApiOkResponse({ type: PaginatedQuotesResponseDto })
  @ApiResponse({
    status: 400,
    description: 'Invalid query parameters',
    type: ApiErrorResponseDto,
  })
  findAll(
    @Query() query: FindQuotesQueryDto,
  ): Promise<PaginatedQuotesResponseDto> {
    return this.quoteService.findAll(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({ type: QuoteResponseDto })
  @ApiResponse({
    status: 404,
    description: 'Quote not found',
    type: ApiErrorResponseDto,
  })
  findById(@Param() params: FindQuoteByIdDto): Promise<QuoteResponseDto> {
    return this.quoteService.findById(params.id);
  }
}
