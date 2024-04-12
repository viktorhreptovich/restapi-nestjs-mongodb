import { APIResponse } from 'playwright-core';
import { expect, test } from './fixtures';

export class TestApiResponse {
  constructor(readonly response: APIResponse) {

  }

  async shouldBeOk() {
    await test.step('Response should be ok', async () => {
      expect(this.response.ok()).toBeTruthy();
    });
  }

  async shouldBeFailed() {
    await test.step('Response should be failed', async () => {
      expect(this.response.ok()).toBeFalsy();
    });
  }

  async shouldHaveResponseStatus(expected: number) {
    await test.step(`Response status should be ${expected}`, async () => {
      expect(this.response).toHaveResponseStatus(expected);
    });

  }

  async jsonShouldHaveProperty(property: string, propertyValue?: any) {
    await test.step(`Response body should have property '${property}'`, async () => {
      if (propertyValue) {
        expect(await this.response.json(), `Response body should have property '${property}' = '${propertyValue}'`)
          .toHaveProperty(property, propertyValue);
      } else {
        expect(await this.response.json(), `Response body should have property '${property}'`).toHaveProperty(property);
      }
    });
  }

  async shouldHaveBadRequestError(message: string) {
    await test.step(`Should receive bad request error: {message: ${message}}`, async () => {
      expect(this.response.status()).toBe(400);
      expect(this.response.statusText()).toBe('Bad Request');
      expect(await this.response.json()).toHaveProperty('message', [message]);
    });
  }

  async shouldHaveError(message: string) {
    await test.step(`Should receive error: {message: ${message}}`, async () => {
      expect(await this.response.json()).toHaveProperty('message', message);
    });
  }

}
