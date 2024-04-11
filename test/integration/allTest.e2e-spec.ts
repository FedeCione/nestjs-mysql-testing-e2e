import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { DataSource } from 'typeorm';

describe('/POST Posts', () => {
  let app: INestApplication;

  // Initialize app before all tests
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();

    // Clean tables of database before all tests
    const dataSource = app.get(DataSource);
    await dataSource.query('DELETE FROM posts');
    await dataSource.query('DELETE FROM users');
  }, 10000);

  // Clean tables of database after each test
  afterEach(async () => {
    const dataSource = await app.get(DataSource);
    await dataSource.query('DELETE FROM posts');
    await dataSource.query('DELETE FROM users');
  }, 10000);

  // Close app after all tests
  afterAll(async () => {
    await app.close();
  }, 10000);

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
  }, 10000);

  it('Create post - User not found: 404 status code', async () => {
    return request(app.getHttpServer())
      .post('/api/posts')
      .send({
        title: 'Post',
        content: 'Post Content',
        authorId: 1,
      })
      .expect(404);
  }, 10000);
});

describe('/GET Posts', () => {
  let app: INestApplication;

  // Initialize app before all tests
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();

    // Clean tables of database before all tests
    const dataSource = await app.get(DataSource);
    await dataSource.query('DELETE FROM posts');
    await dataSource.query('DELETE FROM users');
  });

  // Clean tables of database after each test
  afterEach(async () => {
    const dataSource = await app.get(DataSource);
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

describe('/POST Users', () => {
  let app: INestApplication;

  // Initialize app before all tests
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();

    // Clean tables of database before all tests
    const dataSource = await app.get(DataSource);
    await dataSource.query('DELETE FROM posts');
    await dataSource.query('DELETE FROM users');
  }, 10000);

  // Close app after all tests
  afterAll(async () => {
    await app.close();
  }, 10000);

  it('Create user: 201 status code', async () => {
    return request(app.getHttpServer())
      .post('/api/users')
      .send({
        email: 'fede@gmail.com',
        password: '123456',
      })
      .expect(201);
  }, 10000);

  it('Create user but already exists: 409 status code', async () => {
    return request(app.getHttpServer())
      .post('/api/users')
      .send({
        email: 'fede@gmail.com',
        password: '123456',
      })
      .expect(409);
  }, 10000);
});

describe('/GET Users', () => {
  let app: INestApplication;

  // Initialize app before all tests
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();

    // Clean tables of database before all tests
    const dataSource = await app.get(DataSource);
    await dataSource.query('DELETE FROM posts');
    await dataSource.query('DELETE FROM users');
  }, 10000);

  // Clean tables of database after each test
  afterEach(async () => {
    const dataSource = await app.get(DataSource);
    await dataSource.query('DELETE FROM posts');
    await dataSource.query('DELETE FROM users');
  }, 10000);

  // Close app after all tests
  afterAll(async () => {
    await app.close();
  }, 10000);

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
  }, 10000);

  it('Get users: 404 status code', async () => {
    return request(app.getHttpServer()).get('/api/users').expect({
      statusCode: 404,
      message: 'NOT_FOUND - User/s not found',
    });
  }, 10000);
});
