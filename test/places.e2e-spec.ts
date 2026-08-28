import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { HttpExceptionFilter } from './../src/common/filters/http-exception.filter';

describe('Places (e2e)', () => {
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

  it('GET /api/places returns the paginated envelope with total 41', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/places')
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        data: expect.any(Array),
        page: 1,
        limit: 20,
        total: 41,
      }),
    );
  });

  it('GET /api/places/1 returns The Shire', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/places/1')
      .expect(200);

    expect(response.body).toMatchObject({ id: 1, name: 'The Shire' });
  });

  it('GET /api/places/999999 returns 404 with message as an array', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/places/999999')
      .expect(404);

    expect(Array.isArray(response.body.message)).toBe(true);
    expect(response.body).toMatchObject({
      statusCode: 404,
      error: 'Not Found',
      path: '/api/places/999999',
    });
  });

  it('GET /api/places?type=realm filters by exact type', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/places?type=realm')
      .expect(200);

    expect(response.body.data.length).toBeGreaterThan(0);
    for (const place of response.body.data) {
      expect(place.type).toBe('realm');
    }
  });

  it('GET /api/places?name=Gondor filters by substring', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/places?name=Gondor')
      .expect(200);

    expect(response.body.data.length).toBeGreaterThan(0);
    for (const place of response.body.data) {
      expect(place.name.toLowerCase()).toContain('gondor');
    }
  });

  it('GET /api/places?type=invalid returns 200 with an empty data array (consistent with the existing race/gender filter contract)', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/places?type=invalid')
      .expect(200);

    expect(response.body.data).toEqual([]);
    expect(response.body.total).toBe(0);
  });

  it('GET /api/places?page=999 returns 200 with an empty data array', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/places?page=999')
      .expect(200);

    expect(response.body.data).toEqual([]);
  });

  it('GET /api/places?limit=abc returns 400 with message as an array', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/places?limit=abc')
      .expect(400);

    expect(Array.isArray(response.body.message)).toBe(true);
  });

  it('GET /api/places/abc returns 400 with message as an array', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/places/abc')
      .expect(400);

    expect(Array.isArray(response.body.message)).toBe(true);
  });

  it('parentId is returned as a plain number or null, never a resolved object', async () => {
    const minasTirith = await request(app.getHttpServer())
      .get('/api/places/17')
      .expect(200);
    expect(minasTirith.body).toMatchObject({
      name: 'Minas Tirith',
      parentId: 2,
    });

    const gondor = await request(app.getHttpServer())
      .get('/api/places/2')
      .expect(200);
    expect(gondor.body).toMatchObject({ name: 'Gondor', parentId: null });

    const mountDoom = await request(app.getHttpServer())
      .get('/api/places/19')
      .expect(200);
    expect(mountDoom.body).toMatchObject({ name: 'Mount Doom', parentId: 5 });

    const hobbiton = await request(app.getHttpServer())
      .get('/api/places/32')
      .expect(200);
    expect(hobbiton.body).toMatchObject({ name: 'Hobbiton', parentId: 1 });

    const edoras = await request(app.getHttpServer())
      .get('/api/places/35')
      .expect(200);
    expect(edoras.body).toMatchObject({ name: 'Edoras', parentId: 4 });
  });
});
