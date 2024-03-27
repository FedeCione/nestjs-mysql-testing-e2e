import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../../src/app.module';
import { DataSource } from 'typeorm';

describe('/GET Posts', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterEach(async () => {
    const dataSource = await app.get(DataSource);
    await dataSource.query('TRUNCATE TABLE posts');
  });

  it('Return posts with 200 status code', async () => {
    return request(app.getHttpServer()).get('/api/posts').expect(200);
  });

  it('Return any post with 404 status code', async () => {
    return request(app.getHttpServer()).get('/api/posts').expect(404);
  });
});
