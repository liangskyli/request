import { afterEach, describe, expect, test, vi } from 'vitest';
import { serializedResponseMiddleware } from '../../src';

describe('serializedResponseMiddleware file', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  test('serializedResponseMiddleware, default config', async () => {
    const nextMock = vi.fn();
    const serializedResponseMiddlewareObj = serializedResponseMiddleware();
    await expect(
      serializedResponseMiddlewareObj({ config: {}, success: false }, nextMock),
    ).resolves.toEqual({
      success: false,
      config: {},
    });
    expect(nextMock).toBeCalledTimes(1);

    await expect(
      serializedResponseMiddlewareObj(
        { config: {}, success: true, response: { data: { retCode: 0 } } },
        nextMock,
      ),
    ).resolves.toEqual({
      config: {},
      success: true,
      response: {
        retCode: 0,
      },
    });

    // no response
    await expect(
      serializedResponseMiddlewareObj({ config: {}, success: true }, nextMock),
    ).resolves.toEqual({
      config: {},
      success: false,
    });
  });
  test('serializedResponseMiddleware, custom config', async () => {
    const nextMock = vi.fn();
    const serializedResponseMiddlewareObj = serializedResponseMiddleware({
      serializedResponseCodeKey: 'code',
      serializedResponseSuccessCode: '1',
    });
    await expect(
      serializedResponseMiddlewareObj(
        { config: {}, success: false, response: { error: 'error' } },
        nextMock,
      ),
    ).resolves.toEqual({
      config: {},
      success: false,
      response: {
        error: 'error',
      },
    });
    expect(nextMock).toBeCalledTimes(1);

    await expect(
      serializedResponseMiddlewareObj(
        { config: {}, success: true, response: { data: { code: 1 } } },
        nextMock,
      ),
    ).resolves.toEqual({
      config: {},
      success: true,
      response: {
        code: 1,
      },
    });
  });
});
