import { APIRequestContext, test } from '@playwright/test';
import { APIResponse } from 'playwright-core';
import { TestApiResponse } from '../fixtures/test-api-response';

export class AuthService {
  readonly request: APIRequestContext;
  readonly APP_URI = process.env.APP_URI;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async login(user: { email?: string; password?: string }): Promise<TestApiResponse> {
    let response: APIResponse;
    await test.step('GET /auth/login', async () => {
      response = await this.request.get(`${this.APP_URI}/auth/login`, { data: user });
    });
    return new TestApiResponse(response);
  }

  async signup(newUser: { password: string; name: string; email: string }): Promise<TestApiResponse> {
    let response: APIResponse;
    await test.step('POST /auth/signup', async () => {
      response = await this.request.post(`${this.APP_URI}/auth/signup`, { data: newUser });
    });
    return new TestApiResponse(response);
  }
}
