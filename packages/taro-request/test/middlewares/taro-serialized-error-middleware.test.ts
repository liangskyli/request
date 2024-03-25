import { afterEach, describe, expect, test, vi } from 'vitest';
import { taroSerializedErrorMiddleware } from '../../src/middlewares/taro-serialized-error-middleware';

describe('taroSerializedErrorMiddleware file', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  test('taroSerializedErrorMiddleware', async () => {
    const nextMock = vi.fn();
    const serializedErrorMiddlewareObj = taroSerializedErrorMiddleware({});
    await expect(
      serializedErrorMiddlewareObj(
        {
          config: {},
          success: false,
          error: {
            statusCode: 404,
            data: '<!DOCTYPE html>↵<html lang=\'en">↵<head>↵<meta charset="utf-8\'>↵<title>Error</title>↵</head>↵<body>↵<pre>Cannot GET /api/get-list</pre>↵</body>↵</html>↵',
            errMsg: 'request:ok',
          },
        },
        nextMock,
      ),
    ).resolves.toMatchObject({
      config: {},
      success: false,
      error: {
        _isSerializedError: true,
        retCode: 404,
        retMsg: '404',
      },
    });
    expect(nextMock).toBeCalledTimes(1);

    await expect(
      serializedErrorMiddlewareObj(
        {
          config: {},
          success: false,
          error: {
            statusCode: 200,
            data: {
              retCode: '10',
              retMsg: 'retMsg',
            },
          },
        },
        nextMock,
      ),
    ).resolves.toMatchObject({
      config: {},
      success: false,
      error: {
        _isSerializedError: true,
        retCode: '10',
        retMsg: 'retMsg',
      },
    });
  });
});
