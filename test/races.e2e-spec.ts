import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { HttpExceptionFilter } from './../src/common/filters/http-exception.filter';

describe('Races (e2e)', () => {
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

  it('GET /api/races returns the paginated envelope with total 19', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/races')
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        data: expect.any(Array),
        page: 1,
        limit: 20,
        total: 19,
      }),
    );
  });

  it('GET /api/races/1 returns Men', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/races/1')
      .expect(200);

    expect(response.body).toMatchObject({ id: 1, name: 'Men' });
  });

  it('GET /api/races/19 returns Uruk-hai', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/races/19')
      .expect(200);

    expect(response.body).toMatchObject({ id: 19, name: 'Uruk-hai' });
  });

  it('GET /api/races/999999 returns 404 with message as an array', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/races/999999')
      .expect(404);

    expect(Array.isArray(response.body.message)).toBe(true);
    expect(response.body).toMatchObject({
      statusCode: 404,
      error: 'Not Found',
      path: '/api/races/999999',
    });
  });

  it('GET /api/races?type=major-race filters by exact type', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/races?type=major-race')
      .expect(200);

    expect(response.body.data.length).toBeGreaterThan(0);
    for (const race of response.body.data) {
      expect(race.type).toBe('major-race');
    }
  });

  it('GET /api/races?name=Elves filters by substring', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/races?name=Elves')
      .expect(200);

    expect(response.body.data.length).toBeGreaterThan(0);
    for (const race of response.body.data) {
      expect(race.name.toLowerCase()).toContain('elves');
    }
  });

  it('GET /api/races?type=invalid returns 200 with an empty data array (consistent with the existing filter contract)', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/races?type=invalid')
      .expect(200);

    expect(response.body.data).toEqual([]);
    expect(response.body.total).toBe(0);
  });

  it('GET /api/races?page=999 returns 200 with an empty data array', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/races?page=999')
      .expect(200);

    expect(response.body.data).toEqual([]);
  });

  it('GET /api/races?limit=abc returns 400 with message as an array', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/races?limit=abc')
      .expect(400);

    expect(Array.isArray(response.body.message)).toBe(true);
  });

  it('GET /api/races/abc returns 400 with message as an array', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/races/abc')
      .expect(400);

    expect(Array.isArray(response.body.message)).toBe(true);
  });

  it('parentId is returned as a plain number or null, never a resolved object', async () => {
    const noldor = await request(app.getHttpServer())
      .get('/api/races/7')
      .expect(200);
    expect(noldor.body).toMatchObject({ name: 'Noldor', parentId: 2 });

    const elves = await request(app.getHttpServer())
      .get('/api/races/2')
      .expect(200);
    expect(elves.body).toMatchObject({ name: 'Elves', parentId: null });

    const urukHai = await request(app.getHttpServer())
      .get('/api/races/19')
      .expect(200);
    expect(urukHai.body).toMatchObject({ name: 'Uruk-hai', parentId: 10 });

    const dunedain = await request(app.getHttpServer())
      .get('/api/races/5')
      .expect(200);
    expect(dunedain.body).toMatchObject({ name: 'Dunedain', parentId: 1 });

    const harfoots = await request(app.getHttpServer())
      .get('/api/races/16')
      .expect(200);
    expect(harfoots.body).toMatchObject({ name: 'Harfoots', parentId: 4 });
  });
});
