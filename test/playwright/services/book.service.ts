import { APIRequestContext, test } from '@playwright/test';
import { APIResponse } from 'playwright-core';
import { TestApiResponse } from '../fixtures/test-api-response';

export class BookService {
  readonly request: APIRequestContext;
  readonly APP_URI = process.env.APP_URI;

  constructor(request: APIRequestContext) {
    this.request = request;

  }

  async getBookById(id: string): Promise<TestApiResponse> {
    let response: APIResponse;
    await test.step('GET /booos/{id}', async () => {
      response = await this.request.get(`${this.APP_URI}/books/${id}`, { params: { id } });
    });
    return new TestApiResponse(response);
  }
}
