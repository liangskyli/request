import { afterEach, describe, expect, test, vi } from 'vitest';
import { serializedResponseMiddleware } from '../../src';

describe('serializedResponseMiddleware file', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  test('serializedResponseMiddleware, default config', async () => {
    const nextMock = vi.fn();
    const serializedResponseMiddlewareObj = serializedResponseMiddleware();
    await serializedResponseMiddlewareObj(
      { config: {}, success: false },
      nextMock,
    );
    expect(nextMock).toBeCalledTimes(1);

    await serializedResponseMiddlewareObj(
      { config: {}, success: true, response: { data: { retCode: 0 } } },
      nextMock,
    ).then((ctx) => {
      expect(ctx).toMatchObject({
        success: true,
        response: {
          retCode: 0,
        },
      });
    });

    // no response
    await serializedResponseMiddlewareObj(
      { config: {}, success: true },
      nextMock,
    ).then((ctx) => {
      expect(ctx).toMatchObject({
        success: false,
        error: undefined,
      });
    });
  });
  test('serializedResponseMiddleware, custom config', async () => {
    const nextMock = vi.fn();
    const serializedResponseMiddlewareObj = serializedResponseMiddleware({
      serializedResponseCodeKey: 'code',
      serializedResponseSuccessCode: '1',
    });
    await serializedResponseMiddlewareObj(
      { config: {}, success: false },
      nextMock,
    );
    expect(nextMock).toBeCalledTimes(1);

    await serializedResponseMiddlewareObj(
      { config: {}, success: true, response: { data: { code: 1 } } },
      nextMock,
    ).then((ctx) => {
      expect(ctx).toMatchObject({
        success: true,
        response: {
          code: 1,
        },
      });
    });
  });
});
