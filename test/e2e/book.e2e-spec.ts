import { INestApplication } from '@nestjs/common';
import { StartedTestContainer } from 'testcontainers/build/test-container';
import { createContainer } from './mongodb.init';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import * as request from 'supertest';
import { Category } from '../../src/book/schemas/book.schema';

describe('Book Controller (e2e)', () => {
  let app: INestApplication;
  let mongodbContainer: StartedTestContainer;


  beforeAll(async () => {
    const container = await createContainer('./test/e2e/db/mongo-init-book.js');
    mongodbContainer = await container.start();
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

  it('(POST) - Create a new book', async () => {

    const user = {
      email: 'jhon@example.com',
      password: '123456'
    };
    let token;

    await request(app.getHttpServer())
      .get('/auth/login')
      .send(user)
      .expect(200)
      .then((res) => {
        expect(res.body.token).toBeDefined();
        token = res.body.token;
      });

    const newBook = {
      'title': 'Lord of the Rings',
      'description': 'This is the description',
      'author': 'J.R.R. Tolkien',
      'price': 100,
      'category': Category.FANTASY
    };
    await request(app.getHttpServer())
      .post('/books')
      .set('Authorization', `Bearer ${token}`)
      .send(newBook)
      .expect(201)
      .then((res) => {
        expect(res.body._id).toBeDefined();
        expect(res.body.title).toEqual(newBook.title);
        expect(res.body.description).toEqual(newBook.description);
        expect(res.body.author).toEqual(newBook.author);
        expect(res.body.price).toEqual(newBook.price);
        expect(res.body.category).toEqual(newBook.category);
      });
  });
});
