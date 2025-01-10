import { expect, test } from '../fixtures/fixtures';
import { StartedDockerComposeEnvironment } from 'testcontainers';
import { dockerContainers } from '../utils/dockerContainers';

test.use({
  initDatabaseScript: 'mongo-init-book.js'
});
test.describe('Book service', () => {

  test('GET - Successful get all books', async ({ bookService }) => {

    const response = await bookService.getAllBooks();

    await response.shouldBeOk();
    await response.shouldHaveResponseStatus(200);
    await response.jsonShouldHaveProperty('length', 2);
    await response.shouldContainJsonArray(
      [
        {
          title: 'Lord of the Rings',
          author: 'J.R.R. Tolkien',
          description: 'This is the description',
          price: 101,
          category: 'fantasy'
        },
        {
          title: 'The Hobbit',
          author: 'J.R.R. Tolkien',
          description: 'This is the description of the Hobbit',
          price: 99,
          category: 'fantasy'
        }
      ]
    );
  });

  test('GET - Successful get book by id', async ({ bookService }) => {

    const response = await bookService.getBookById('6618b6d8607744f03afbb359');

    await response.shouldBeOk();
    await response.shouldHaveResponseStatus(200);
    await response.jsonShouldHaveProperty('title', 'Lord of the Rings');
    await response.jsonShouldHaveProperty('author', 'J.R.R. Tolkien');
    await response.jsonShouldHaveProperty('description', 'This is the description');
    await response.jsonShouldHaveProperty('price', 101);
    await response.jsonShouldHaveProperty('category', 'fantasy');

  });

  test('(GET) - Error get book by id when id is invalid', async ({ bookService }) => {
    const response = await bookService.getBookById('invalid');

    await response.shouldBeFailed();
    await response.shouldHaveBadRequestError('Invalid book id');
  });

});
