import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { HttpExceptionFilter } from './../src/common/filters/http-exception.filter';

describe('Ainur (e2e)', () => {
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

  it('GET /api/ainur returns the paginated envelope with total 23', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/ainur')
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        data: expect.any(Array),
        page: 1,
        limit: 20,
        total: 23,
      }),
    );
  });

  it('GET /api/ainur/1 returns Eru Iluvatar', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/ainur/1')
      .expect(200);

    expect(response.body).toMatchObject({ id: 1, type: 'creator' });
    expect(response.body).not.toHaveProperty('parentId');
  });

  it('GET /api/ainur/23 returns the last record', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/ainur/23')
      .expect(200);

    expect(response.body).toMatchObject({ id: 23 });
  });

  it('GET /api/ainur/999999 returns 404 with message as an array', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/ainur/999999')
      .expect(404);

    expect(Array.isArray(response.body.message)).toBe(true);
    expect(response.body).toMatchObject({
      statusCode: 404,
      error: 'Not Found',
      path: '/api/ainur/999999',
    });
  });

  it('GET /api/ainur?type=Vala filters by exact type', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/ainur?type=Vala')
      .expect(200);

    expect(response.body.data.length).toBeGreaterThan(0);
    for (const entity of response.body.data) {
      expect(entity.type).toBe('Vala');
    }
  });

  it('GET /api/ainur?name=Gandalf filters by substring', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/ainur?name=Gandalf')
      .expect(200);

    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].name).toBe('Gandalf');
  });

  it('GET /api/ainur?characterId=2 returns the linked Ainur record for Gandalf', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/ainur?characterId=2')
      .expect(200);

    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0]).toMatchObject({
      name: 'Gandalf',
      characterId: 2,
    });
  });

  it('a record with characterId null exists (e.g. Manwe)', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/ainur?name=Manw')
      .expect(200);

    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].characterId).toBeNull();
  });

  it('GET /api/ainur?type=invalid returns 200 with an empty data array', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/ainur?type=invalid')
      .expect(200);

    expect(response.body.data).toEqual([]);
    expect(response.body.total).toBe(0);
  });

  it('GET /api/ainur?page=999 returns 200 with an empty data array', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/ainur?page=999')
      .expect(200);

    expect(response.body.data).toEqual([]);
  });

  it('GET /api/ainur?limit=abc returns 400 with message as an array', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/ainur?limit=abc')
      .expect(400);

    expect(Array.isArray(response.body.message)).toBe(true);
  });

  it('GET /api/ainur/abc returns 400 with message as an array', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/ainur/abc')
      .expect(400);

    expect(Array.isArray(response.body.message)).toBe(true);
  });
});
