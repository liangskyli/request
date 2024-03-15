import { afterEach, describe, expect, test, vi } from 'vitest';
import { serializedErrorMiddleware } from '../../src';

describe('serializedErrorMiddleware file', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  test('serializedErrorMiddleware, success: true', async () => {
    const checkIsCancelMock = vi.fn();
    const getErrorResponseMock = vi.fn();
    const nextMock = vi.fn();
    const serializedErrorMiddlewareObj = serializedErrorMiddleware({
      checkIsCancel: checkIsCancelMock,
      getErrorResponse: getErrorResponseMock,
    });
    await serializedErrorMiddlewareObj(
      {
        config: {},
        success: true,
      },
      nextMock,
    );
    expect(checkIsCancelMock).toBeCalledTimes(0);
    expect(getErrorResponseMock).toBeCalledTimes(0);
    expect(nextMock).toBeCalledTimes(1);
  });
  test('serializedErrorMiddleware, success: false', async () => {
    const checkIsCancelMock = vi.fn();
    const getErrorResponseMock = vi.fn();
    const nextMock = vi.fn();
    const serializedErrorMiddlewareObj = serializedErrorMiddleware({
      checkIsCancel: checkIsCancelMock,
      getErrorResponse: getErrorResponseMock,
    });
    await expect(
      serializedErrorMiddlewareObj(
        {
          config: {},
          success: false,
          error: {},
        },
        nextMock,
      ),
    ).resolves.toMatchObject({
      config: {},
      success: false,
      error: {
        _isSerializedError: true,
        retMsg: '未知错误，请稍后再试',
      },
    });
    expect(checkIsCancelMock).toBeCalledTimes(1);
    expect(getErrorResponseMock).toBeCalledTimes(1);
    expect(nextMock).toBeCalledTimes(1);
  });
  test('serializedErrorMiddleware, success: false,_isSerializedError:true', async () => {
    const checkIsCancelMock = vi.fn();
    const getErrorResponseMock = vi.fn();
    const nextMock = vi.fn();
    const serializedErrorMiddlewareObj = serializedErrorMiddleware({
      checkIsCancel: checkIsCancelMock,
      getErrorResponse: getErrorResponseMock,
    });
    await expect(
      serializedErrorMiddlewareObj(
        {
          config: {},
          success: false,
          error: {
            _isSerializedError: true,
            retCode: 'retCodeValue',
            retMsg: 'retMsgValue',
          },
        },
        nextMock,
      ),
    ).resolves.toMatchObject({
      config: {},
      success: false,
      error: {
        _isSerializedError: true,
        retCode: 'retCodeValue',
        retMsg: 'retMsgValue',
      },
    });
    expect(checkIsCancelMock).toBeCalledTimes(0);
    expect(getErrorResponseMock).toBeCalledTimes(0);
    expect(nextMock).toBeCalledTimes(1);
  });
  test('serializedErrorMiddleware, success: false, custom error', async () => {
    const checkIsCancelMock = vi.fn();
    const nextMock = vi.fn();
    const serializedErrorMiddlewareObj = serializedErrorMiddleware({
      checkIsCancel: checkIsCancelMock,
      getErrorResponse: (error) => error,
      serializedErrorCodeKey: 'customRetCode',
      serializedErrorMessageKey: 'customRetMsg',
      responseCodeKey: ['responseCodeKey', 'code', 'status'],
      responseMessageKey: ['responseMessageKey', 'message', 'statusText'],
    });
    await expect(
      serializedErrorMiddlewareObj(
        {
          config: {},
          success: false,
          error: {
            responseCodeKey: 'responseCodeKeyValue',
            responseMessageKey: 'responseMessageKeyValue',
          },
        },
        nextMock,
      ),
    ).resolves.toMatchObject({
      config: {},
      success: false,
      error: {
        _isSerializedError: true,
        customRetCode: 'responseCodeKeyValue',
        customRetMsg: 'responseMessageKeyValue',
      },
    });
    expect(checkIsCancelMock).toBeCalledTimes(1);
    expect(nextMock).toBeCalledTimes(1);
  });
  test('serializedErrorMiddleware, success: false,throw error', async () => {
    const checkIsCancelMock = vi.fn();
    const getErrorResponseMock = vi.fn();
    const serializedErrorMiddlewareObj = serializedErrorMiddleware({
      checkIsCancel: checkIsCancelMock,
      getErrorResponse: getErrorResponseMock,
    });
    await expect(
      serializedErrorMiddlewareObj(
        {
          config: {},
          success: false,
          error: {},
        },
        () => {
          return Promise.reject('error');
        },
      ),
    ).rejects.toMatchObject({
      _isSerializedError: true,
      retMsg: '未知错误，请稍后再试',
    });
    expect(checkIsCancelMock).toBeCalledTimes(1);
    expect(getErrorResponseMock).toBeCalledTimes(1);
  });
});
