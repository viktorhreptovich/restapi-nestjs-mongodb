import { expect, test } from '../fixtures/fixtures';
import { StartedDockerComposeEnvironment } from 'testcontainers';
import { dockerContainers } from '../utils/dockerContainers';

test.use({
  initDatabaseScript: 'mongo-init-book.js'
});
test.describe('Book service', () => {

  test('GET - Successful get book by id', async ({ bookService }) => {

    const response = await bookService.getBookById('6618b6d8607744f03afbb359');

    await response.shouldBeOk();
    await response.shouldHaveResponseStatus(200);
    await response.jsonShouldHaveProperty('title', 'Lord of the Rings');
    await response.jsonShouldHaveProperty('author', 'J.R.R. Tolkien');
    await response.jsonShouldHaveProperty('description', 'This is the description');
    await response.jsonShouldHaveProperty('price', 100);
    await response.jsonShouldHaveProperty('category', 'fantasy');

  });

  test('(GET) - Error get book by id when id is invalid', async ({ bookService }) => {
    const response = await bookService.getBookById('invalid');

    await response.shouldBeFailed();
    await response.shouldHaveBadRequestError('Invalid book id');
  });

});
