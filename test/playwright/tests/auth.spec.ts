import { test } from '../fixtures/fixtures';
import { faker } from '@faker-js/faker';


test.use({
  initDatabaseScript: 'mongo-init-auth.js'
});

test.describe('Auth service', () => {

  test('GET /auth/login - Successful user login with valid credentials', async ({ authService }) => {
    const user = {
      email: 'jhon@example.com',
      password: '123456'
    };

    const response = await authService.login(user);

    await response.shouldBeOk();
    await response.shouldHaveResponseStatus(200);
    await response.jsonShouldHaveProperty('token');
  });

  test('POST /auth/signup - Successful register a new user', async ({ authService }) => {
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

  test('POST /auth/signup - Register user with existing email should fail', async ({ authService }) => {
    const userWithExistingEmail = {
      name: 'John Doe',
      email: 'jhon@example.com',
      password: '123456'
    };

    const response = await authService.signup(userWithExistingEmail);

    await response.shouldBeFailed();
    await response.shouldHaveResponseStatus(409);
    await response.shouldHaveError('Email already in use');
  });
});



