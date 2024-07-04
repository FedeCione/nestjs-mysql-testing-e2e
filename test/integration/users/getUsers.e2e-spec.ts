import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../../src/app.module';
import { DataSource } from 'typeorm';

describe('/GET Users', () => {
  let app: INestApplication;

  // Initialize app before all tests
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // Clean tables of database before all tests
    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();

    const dataSource = app.get(DataSource);
    await dataSource.query('DELETE FROM posts');
    await dataSource.query('DELETE FROM users');
  });

  // Clean tables of database after each test
  afterEach(async () => {
    const dataSource = await app.get(DataSource);
    await dataSource.query('DELETE FROM posts');
    await dataSource.query('DELETE FROM users');
  });

  // Close app after all tests and clean table in database
  afterAll(async () => {
    await app.close();
  });

  it('Get users: 200 status code', async () => {
    const createdUser = await request(app.getHttpServer())
      .post('/api/users')
      .send({
        email: 'fede@gmail.com',
        password: '123456',
      });
    const userId = createdUser.body.id;
    const createdAt = createdUser.body.createdAt;

    return request(app.getHttpServer())
      .get('/api/users')
      .expect((res) => {
        expect(res.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: userId,
              email: 'fede@gmail.com',
              password: '123456',
              createdAt: createdAt,
              posts: [],
            }),
          ]),
        );
      })
      .expect(200);
  });

  it('Get users: 404 status code', async () => {
    return request(app.getHttpServer()).get('/api/users').expect({
      statusCode: 404,
      message: 'NOT_FOUND - User/s not found',
    });
  });
});
