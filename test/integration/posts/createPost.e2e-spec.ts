import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../../src/app.module';
import { DataSource } from 'typeorm';

describe('/POST Posts', () => {
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

  it('Create post: 201 status code', async () => {
    const createdUser = await request(app.getHttpServer())
      .post('/api/users')
      .send({
        email: 'fede@gmail.com',
        password: '123456',
      });
    const userId = createdUser.body.id;
    return request(app.getHttpServer())
      .post('/api/posts')
      .send({
        title: 'Post',
        content: 'Post Content',
        authorId: userId,
      })
      .expect(201);
  });

  it('Create post - User not found: 404 status code', async () => {
    return request(app.getHttpServer())
      .post('/api/posts')
      .send({
        title: 'Post',
        content: 'Post Content',
        authorId: 1,
      })
      .expect(404);
  });
});
