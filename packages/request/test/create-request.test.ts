import { afterEach, describe, expect, test, vi } from 'vitest';
import type { Context, Middleware } from '../src';
import { createRequest } from '../src';

describe('createRequest file', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  test('createRequest', async () => {
    const initConfig = { a: 1 };
    const requestFunction = async (config: { a?: number; url: string }) => {
      return Promise.resolve({ data: config });
    };
    const createRequestObj = createRequest<typeof requestFunction>(
      requestFunction,
      initConfig,
    );
    const requestMiddlewareMock = vi.fn();
    const requestMiddleware = (): Middleware<
      Context<
        { a?: number; url: string },
        { data: { a?: number; url: string } }
      >
    > => {
      return async (ctx, next) => {
        requestMiddlewareMock();
        await next();
        return ctx;
      };
    };
    const responseMiddlewareMock = vi.fn();
    const responseMiddleware = (): Middleware<
      Context<
        { a?: number; url: string },
        { data: { a?: number; url: string } }
      >
    > => {
      return async (ctx, next) => {
        await next();
        responseMiddlewareMock();
        return ctx;
      };
    };
    createRequestObj.middlewares.request.use(requestMiddleware());
    createRequestObj.middlewares.response.use(responseMiddleware());

    expect(await createRequestObj({ url: 'url1' })).toEqual({
      data: { a: 1, url: 'url1' },
    });
    expect(requestMiddlewareMock).toBeCalledTimes(1);
    expect(responseMiddlewareMock).toBeCalledTimes(1);
    expect(await createRequestObj.request({ a: 2, url: 'url2' })).toEqual({
      data: { a: 2, url: 'url2' },
    });
    expect(requestMiddlewareMock).toBeCalledTimes(2);
    expect(responseMiddlewareMock).toBeCalledTimes(2);

    // createApi
    requestMiddlewareMock.mockClear();
    responseMiddlewareMock.mockClear();
    const createApi = await createRequestObj.createApi()({ a: 2 });
    expect(await createApi({ url: 'url1' })).toEqual({
      data: { a: 2, url: 'url1' },
    });
    expect(requestMiddlewareMock).toBeCalledTimes(1);
    expect(responseMiddlewareMock).toBeCalledTimes(1);
  });
  test('createRequest,error', async () => {
    const initConfig = { a: 1 };
    const requestFunction = async (config: { a?: number; url: string }) => {
      if (config.url === 'url_error') {
        return Promise.reject({ retMsg: 'retMsg', code: 1 });
      } else {
        return Promise.resolve({ data: config, code: 0 });
      }
    };
    const createRequestObj = createRequest<typeof requestFunction>(
      requestFunction,
      initConfig,
    );
    await expect(createRequestObj({ url: 'url_error' })).rejects.toEqual({
      retMsg: 'retMsg',
      code: 1,
    });

    // request middlewares error
    createRequestObj.middlewares.request.use(async () => {
      throw new Error('request middlewares error');
    });

    await expect(createRequestObj({ url: 'url_error' })).rejects.toThrow(
      'request middlewares error',
    );

    await expect(createRequestObj({ url: 'url_ok' })).rejects.toThrow(
      'request middlewares error',
    );

    // response middlewares error
    createRequestObj.middlewares.request.eject(0);
    createRequestObj.middlewares.response.use(async (ctx, next) => {
      await next();
      throw new Error('response middlewares error');
    });

    await expect(createRequestObj({ url: 'url_error' })).rejects.toEqual({
      retMsg: 'retMsg',
      code: 1,
    });

    await expect(createRequestObj({ url: 'url_ok' })).rejects.toThrow(
      'response middlewares error',
    );
  });
});
