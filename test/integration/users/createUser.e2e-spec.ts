import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../../src/app.module';
import { DataSource } from 'typeorm';

export function usersCreateTest() {
  describe('/POST Users', () => {
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

    // Close app after all tests and clean table in database
    afterAll(async () => {
      await app.close();
    });

    it('Create user: 201 status code', async () => {
      return request(app.getHttpServer())
        .post('/api/users')
        .send({
          email: 'fede@gmail.com',
          password: '123456',
        })
        .expect(201);
    });

    it('Create user but already exists: 409 status code', async () => {
      return request(app.getHttpServer())
        .post('/api/users')
        .send({
          email: 'fede@gmail.com',
          password: '123456',
        })
        .expect(409);
    });
  });
}
