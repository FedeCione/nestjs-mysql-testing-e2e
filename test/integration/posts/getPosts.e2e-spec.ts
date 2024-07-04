// postsGet.test.ts
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../../src/app.module';
import { DataSource } from 'typeorm';

describe('/GET Posts', () => {
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
    const dataSource = app.get(DataSource);
    await dataSource.query('DELETE FROM posts');
    await dataSource.query('DELETE FROM users');
  });

  // Close app after all tests
  afterAll(async () => {
    await app.close();
  });

  it('Return posts: 200 status code', async () => {
    const createdUser = await request(app.getHttpServer())
      .post('/api/users')
      .send({
        email: 'fede@gmail.com',
        password: '123456',
      });
    const userId = createdUser.body.id;

    const createdPost = await request(app.getHttpServer())
      .post('/api/posts')
      .send({
        title: 'Post',
        content: 'Post Content',
        authorId: userId,
      });
    const postId = createdPost.body.id;

    request(app.getHttpServer())
      .get('/api/posts')
      .expect([
        {
          id: postId,
          title: 'Post',
          content: 'Post Content',
          authorId: userId,
        },
      ])
      .expect(200);
  });

  it('Return posts: 404 status code', async () => {
    request(app.getHttpServer())
      .get('/api/posts')
      .expect({
        statusCode: 404,
        message: 'NOT_FOUND - Post/s not found',
      })
      .expect(404);
  });
});
