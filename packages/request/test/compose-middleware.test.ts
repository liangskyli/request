import { afterEach, describe, expect, test, vi } from 'vitest';
import type { Context, Middleware } from '../src';
import { composeMiddleware } from '../src';

describe('composeMiddleware file', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  test('composeMiddleware', async () => {
    try {
      // @ts-ignore
      composeMiddleware('1');
    } catch (e: any) {
      expect(e.message).toBe('Middleware stack must be an array!');
    }
    try {
      // @ts-ignore
      composeMiddleware(['1']);
    } catch (e: any) {
      expect(e.message).toBe('Middleware must be composed of functions!');
    }

    const nextMock = vi.fn();
    const middleware1 = (): Middleware<Context> => {
      return async (ctx, next) => {
        await next();
        return ctx;
      };
    };
    const middleware2 = (): Middleware<Context> => {
      return async (ctx, next) => {
        await next();
        return ctx;
      };
    };

    const composeMiddlewareObj = composeMiddleware([
      middleware1(),
      middleware2(),
    ]);
    await composeMiddlewareObj({ config: { a: 1 }, success: true }, nextMock);
    expect(nextMock).toBeCalledTimes(1);
    expect(nextMock.mock.lastCall[0]).toEqual({
      config: { a: 1 },
      success: true,
    });

    // no next
    const result = await composeMiddlewareObj({
      config: { a: 1 },
      success: true,
    });
    expect(result).toEqual({ config: { a: 1 }, success: true });
  });
  test('composeMiddleware,throw error', async () => {
    const middleware1 = (): Middleware<Context> => {
      return async (ctx, next) => {
        await next();
        return ctx;
      };
    };
    const middleware2 = (): Middleware<Context> => {
      return async (ctx, next) => {
        await next();
        return ctx;
      };
    };

    const composeMiddlewareObj = composeMiddleware([
      middleware1(),
      middleware2(),
    ]);

    await composeMiddlewareObj(
      { config: { a: 1 }, success: true },
      // @ts-ignore
      'next',
    ).catch((e) => {
      expect(e.message).toBe('fn is not a function');
    });
  });
});
