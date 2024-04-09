import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { StartedTestContainer } from 'testcontainers/build/test-container';
import { createContainer } from './mongodb.init';
import * as process from 'process';
import { MongooseModule } from '@nestjs/mongoose';

describe('Auth Controller (e2e)', () => {
  let app: INestApplication;
  let mongodbContainer: StartedTestContainer;


  beforeAll(async () => {
    const container = await createContainer('./test/e2e/db/mongo-init-auth.js');
    mongodbContainer = await container.start();
    console.log('mongodbContainer: ', mongodbContainer.getFirstMappedPort());
  });

  afterAll(async () => {
    await mongodbContainer.stop();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule.register(`mongodb://admin:password@localhost:${mongodbContainer.getFirstMappedPort()}/${process.env.MONGO_INITDB_DATABASE}`)]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });


  afterEach(async () => {
    await app.close();
  });

  test('(POST) - Register a new user', async () => {
    const username = faker.internet.userName();
    const email = `${username}@example.com`;

    const user = {
      name: username,
      email: email,
      password: '123456'
    };

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(user)
      .expect(201)
      .then((res) => {
        expect(res.body.token).toBeDefined();
      });
  });


  it('(POST) - Login a user', async () => {
    const user = {
      email: 'jhon@example.com',
      password: '123456'
    };

    await request(app.getHttpServer())
      .get('/auth/login')
      .send(user)
      .expect(200)
      .then((res) => {
        expect(res.body.token).toBeDefined();
      });
  });
});
