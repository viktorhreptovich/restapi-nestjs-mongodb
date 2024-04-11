import { expect, test } from '../fixtures/fixtures';
import { StartedDockerComposeEnvironment } from 'testcontainers';
import { dockerContainers } from '../utils/dockerContainers';

test.describe('Book service', () => {
  let container: StartedDockerComposeEnvironment;

  test.beforeAll('Start containers', async ({}, workerInfo) => {
    console.log('Before all');
    test.setTimeout(60000);
    container = await dockerContainers(
      workerInfo.workerIndex.toString(),
    );
  });

  test.afterAll('Stop containers', async () => {
    console.log('After all');
    await container.down();
  });

  test('(GET) - Get book by id (invalid id)', async ({ bookService }) => {
    const response = await bookService.getBookById('invalid');

    await response.shouldHaveBadRequestError('Invalid book id');
  });

});
