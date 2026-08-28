import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { HttpExceptionFilter } from './../src/common/filters/http-exception.filter';

describe('Error contract (e2e)', () => {
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

  it('returns message as an array on 404 for a non-existent numeric id', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/characters/999999')
      .expect(404);

    expect(Array.isArray(response.body.message)).toBe(true);
    expect(response.body).toMatchObject({
      statusCode: 404,
      error: 'Not Found',
      path: '/api/characters/999999',
    });
    expect(typeof response.body.timestamp).toBe('string');
  });

  it('returns 400 when the id path param is not a positive integer', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/characters/not-a-number')
      .expect(400);

    expect(Array.isArray(response.body.message)).toBe(true);
    expect(response.body).toMatchObject({
      statusCode: 400,
      error: 'Bad Request',
    });
  });

  it('returns message as an array on 400 (validation)', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/characters?limit=abc')
      .expect(400);

    expect(Array.isArray(response.body.message)).toBe(true);
    expect(response.body.message.length).toBeGreaterThan(0);
    expect(response.body).toMatchObject({
      statusCode: 400,
      error: 'Bad Request',
    });
  });

  it('keeps the paginated envelope unchanged on success', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/characters')
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        data: expect.any(Array),
        page: expect.any(Number),
        limit: expect.any(Number),
        total: expect.any(Number),
      }),
    );
  });
});
