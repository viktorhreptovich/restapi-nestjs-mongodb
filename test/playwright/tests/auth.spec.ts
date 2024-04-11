import { test } from '../fixtures/fixtures';
import { StartedDockerComposeEnvironment } from 'testcontainers';
import { faker } from '@faker-js/faker';
import { dockerContainers } from '../utils/dockerContainers';


let container: StartedDockerComposeEnvironment;

test.beforeAll('Start containers', async ({}, workerInfo) => {
  test.setTimeout(60000);
  container = await dockerContainers(workerInfo.workerIndex.toString(), 'mongo-init-auth.js');
});

test.afterAll('Stop containers', async () => {
  await container.down();
});

test.describe('Auth service', () => {

  test('(GET) - Login a user', async ({ authService }) => {
    console.log(`Test 1 ${process.env.APP_URI}`);
    const user = {
      email: 'jhon@example.com',
      password: '123456'
    };

    const response = await authService.login(user);

    await response.shouldBeOk();
    await response.shouldHaveResponseStatus(200);
    await response.jsonShouldHaveProperty('token');
  });

  test('(POST) - Register a user', async ({ authService }) => {
    console.log(`Test 2 ${process.env.APP_URI}`);
    const username = faker.internet.userName();
    const email = `${username}@example.com`;
    const password = faker.internet.password({ length: 6 });
    const newUser = {
      name: username,
      email: email,
      password: password
    };

    const response = await authService.signup(newUser);

    await response.shouldBeOk();
    await response.shouldHaveResponseStatus(201);
    await response.jsonShouldHaveProperty('token');
  });
});



