import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { JsonInfrastructureModule } from './infrastructure/json/json-infrastructure.module';
import { HealthModule } from './modules/health/health.module';
import { CharactersModule } from './modules/characters/characters.module';
import { MoviesModule } from './modules/movies/movies.module';
import { BooksModule } from './modules/books/books.module';
import { QuotesModule } from './modules/quotes/quotes.module';
import { PlacesModule } from './modules/places/places.module';
import { RacesModule } from './modules/races/races.module';
import { AinurModule } from './modules/ainur/ainur.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    JsonInfrastructureModule,
    HealthModule,
    CharactersModule,
    MoviesModule,
    BooksModule,
    QuotesModule,
    PlacesModule,
    RacesModule,
    AinurModule,
  ],
})
export class AppModule {}
