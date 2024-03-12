import { afterEach, describe, expect, test, vi } from 'vitest';
import type { Context, Middleware } from '../src';
import { MiddlewareManager } from '../src/middleware-manager';

describe('MiddlewareManager file', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  test('MiddlewareManager', () => {
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
    const middlewareManagerObj = new MiddlewareManager<Context>();
    expect(middlewareManagerObj.middlewares).toEqual([]);
    middlewareManagerObj.use(middleware1());
    expect(middlewareManagerObj.middlewares).toMatchObject([{ priority: 0 }]);
    middlewareManagerObj.use(middleware2(), { priority: 1 });
    expect(middlewareManagerObj.middlewares).toMatchObject([
      { priority: 0 },
      { priority: 1 },
    ]);
    middlewareManagerObj.eject(0);
    expect(middlewareManagerObj.middlewares).toMatchObject([{ priority: 1 }]);
  });
});
