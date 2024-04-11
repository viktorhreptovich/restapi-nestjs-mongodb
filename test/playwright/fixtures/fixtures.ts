import { test as base, expect as baseExpect } from '@playwright/test';
import { AuthService } from '../services/auth.service';
import { APIResponse } from 'playwright-core';
import { BookService } from '../services/book.service';

type Fixtures = {
  authService: AuthService;
  bookService: BookService;
};

export const test = base.extend<Fixtures>({
  authService: async ({ request }, use) => {
    const authService = new AuthService(request);
    await use(authService);
  },

  bookService: async ({ request }, use) => {
    const bookService = new BookService(request);
    await use(bookService);
  }
});

export const expect = baseExpect.extend({
  toHaveResponseStatus(response: APIResponse, expected: number) {
    const assertionName = 'toHaveResponseStatus';
    let pass: boolean;
    let matcherResult: any;

    try {
      baseExpect(response.status()).toEqual(expected);
      pass = true;
    } catch (e: any) {
      matcherResult = e.matcherResult;
      pass = false;
    }

    const mess = pass
      ? () => this.utils.matcherHint(assertionName, undefined, undefined, { isNot: this.isNot }) +
        '\n\n' +
        `Response: ${response.statusText()}\n` +
        `Expected: ${this.isNot ? 'not' : ''}${this.utils.printExpected(expected)}\n` +
        (matcherResult ? `Received: ${this.utils.printReceived(matcherResult.actual)}` : '')
      : () => this.utils.matcherHint(assertionName, undefined, undefined, { isNot: this.isNot }) +
        '\n\n' +
        `Response: ${response.statusText()}\n` +
        `Expected: ${this.utils.printExpected(expected)}\n` +
        (matcherResult ? `Received: ${this.utils.printReceived(matcherResult.actual)}` : '');

    return {
      message: mess,
      pass,
      name: assertionName,
      expected,
      actual: matcherResult?.actual
    };
  }
});
