import { Module } from '@nestjs/common';
import { QuoteController } from './presentation/controllers/quote.controller';
import { QuoteService } from './application/services/quote.service';
import { QUOTE_REPOSITORY } from './data/repositories/quote.repository';
import { JsonQuoteRepository } from './data/repositories/json-quote.repository';
import { CharactersModule } from '../characters/characters.module';
import { MoviesModule } from '../movies/movies.module';

@Module({
  imports: [CharactersModule, MoviesModule],
  controllers: [QuoteController],
  providers: [
    QuoteService,
    { provide: QUOTE_REPOSITORY, useClass: JsonQuoteRepository },
  ],
})
export class QuotesModule {}
