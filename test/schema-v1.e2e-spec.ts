import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { HttpExceptionFilter } from './../src/common/filters/http-exception.filter';

describe('Schema V1 (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('returns numeric ids for characters, movies, books and quotes', async () => {
    const [characters, movies, books, quotes] = await Promise.all([
      request(app.getHttpServer()).get('/api/characters').expect(200),
      request(app.getHttpServer()).get('/api/movies').expect(200),
      request(app.getHttpServer()).get('/api/books').expect(200),
      request(app.getHttpServer()).get('/api/quotes').expect(200),
    ]);

    for (const character of characters.body.data) {
      expect(typeof character.id).toBe('number');
    }
    for (const movie of movies.body.data) {
      expect(typeof movie.id).toBe('number');
      expect(typeof movie.releaseYear).toBe('number');
    }
    for (const book of books.body.data) {
      expect(typeof book.id).toBe('number');
      expect(typeof book.author).toBe('string');
      expect(typeof book.releaseYear).toBe('number');
    }
    for (const quote of quotes.body.data) {
      expect(typeof quote.id).toBe('number');
    }
  });

  it('resolves quote relationships to numeric character/movie summaries', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/quotes/1')
      .expect(200);

    expect(response.body).toMatchObject({
      id: 1,
      character: { id: expect.any(Number), name: expect.any(String) },
      movie: { id: expect.any(Number), name: expect.any(String) },
    });
    expect(response.body.characterId).toBeUndefined();
    expect(response.body.movieId).toBeUndefined();
  });

  it('filters quotes by numeric characterId and movieId', async () => {
    const byCharacter = await request(app.getHttpServer())
      .get('/api/quotes?characterId=2')
      .expect(200);
    for (const quote of byCharacter.body.data) {
      expect(quote.character?.id).toBe(2);
    }

    const byMovie = await request(app.getHttpServer())
      .get('/api/quotes?movieId=1')
      .expect(200);
    for (const quote of byMovie.body.data) {
      expect(quote.movie?.id).toBe(1);
    }
  });

  it('rejects non-numeric characterId/movieId filters with 400', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/quotes?characterId=abc')
      .expect(400);

    expect(Array.isArray(response.body.message)).toBe(true);
  });

  it('returns null (not empty string) for unknown character fields', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/characters/2')
      .expect(200);

    expect(response.body.realm).toBeNull();
    expect(response.body).toHaveProperty('death');
    expect(response.body).toHaveProperty('height');
    expect(response.body).toHaveProperty('spouse');
  });
});
