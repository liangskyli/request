import { afterEach, describe, expect, test, vi } from 'vitest';
import { taroSerializedResponseMiddleware } from '../../src/middlewares/taro-serialized-response-middleware';

describe('taroSerializedResponseMiddleware file', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('taroSerializedResponseMiddleware, success with statusCode 200', async () => {
    const nextMock = vi.fn();
    const middleware = taroSerializedResponseMiddleware();

    await expect(
      middleware(
        {
          config: {},
          success: true,
          response: {
            statusCode: 200,
            data: { retCode: '0', data: 'test data' },
          },
        },
        nextMock,
      ),
    ).resolves.toMatchObject({
      config: {},
      success: true,
      response: {
        retCode: '0',
        data: 'test data',
      },
    });
    expect(nextMock).toBeCalledTimes(1);
  });

  test('taroSerializedResponseMiddleware, success with statusCode !== 200', async () => {
    const nextMock = vi.fn();
    const middleware = taroSerializedResponseMiddleware();

    await expect(
      middleware(
        {
          config: {},
          success: true,
          response: {
            statusCode: 404,
            data: 'Not Found',
          },
        },
        nextMock,
      ),
    ).resolves.toMatchObject({
      config: {},
      success: false,
      error: {
        statusCode: 404,
        data: 'Not Found',
      },
    });
    expect(nextMock).toBeCalledTimes(1);
  });

  test('taroSerializedResponseMiddleware, success false', async () => {
    const nextMock = vi.fn();
    const middleware = taroSerializedResponseMiddleware();

    await expect(
      middleware(
        {
          config: {},
          success: false,
          error: { message: 'error' },
        },
        nextMock,
      ),
    ).resolves.toMatchObject({
      config: {},
      success: false,
    });
    expect(nextMock).toBeCalledTimes(1);
  });

  test('taroSerializedResponseMiddleware, statusCode 500', async () => {
    const nextMock = vi.fn();
    const middleware = taroSerializedResponseMiddleware();

    await expect(
      middleware(
        {
          config: {},
          success: true,
          response: {
            statusCode: 500,
            data: { error: 'Internal Server Error' },
          },
        },
        nextMock,
      ),
    ).resolves.toMatchObject({
      config: {},
      success: false,
      error: {
        statusCode: 500,
        data: { error: 'Internal Server Error' },
      },
    });
    expect(nextMock).toBeCalledTimes(1);
  });
});
