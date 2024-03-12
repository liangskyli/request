import { afterEach, describe, expect, test, vi } from 'vitest';
import { serializedError, serializedErrorMiddleware } from '../../src';

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
    await serializedErrorMiddlewareObj(
      {
        config: {},
        success: false,
        error: {},
      },
      nextMock,
    ).then((ctx) => {
      expect(ctx.error).toMatchObject({
        _isSerializedError: true,
        retCode: '',
        retMsg: '未知错误，请稍后再试',
      });
    });
    expect(checkIsCancelMock).toBeCalledTimes(1);
    expect(getErrorResponseMock).toBeCalledTimes(1);
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
    await serializedErrorMiddlewareObj(
      {
        config: {},
        success: false,
        error: {
          responseCodeKey: 'responseCodeKeyValue',
          responseMessageKey: 'responseMessageKeyValue',
        },
      },
      nextMock,
    ).then((ctx) => {
      expect(ctx.error).toMatchObject({
        _isSerializedError: true,
        customRetCode: 'responseCodeKeyValue',
        customRetMsg: 'responseMessageKeyValue',
      });
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
    try {
      await serializedErrorMiddlewareObj(
        {
          config: {},
          success: false,
          error: {},
        },
        () => {
          return Promise.reject('error');
        },
      );
    } catch (e) {
      expect(e).toMatchObject({
        _isSerializedError: true,
        retCode: '',
        retMsg: '未知错误，请稍后再试',
      });
    }
    expect(checkIsCancelMock).toBeCalledTimes(1);
    expect(getErrorResponseMock).toBeCalledTimes(1);
  });
  test('serializedError, _isSerializedError: true', async () => {
    const checkIsCancelMock = vi.fn();
    const getErrorResponseMock = vi.fn();
    const serializedErrorObj = {
      _isSerializedError: true,
      retCode: 'retCodeValue',
      retMsg: 'retMsgValue',
    };
    expect(
      serializedError(serializedErrorObj, {
        checkIsCancel: checkIsCancelMock,
        getErrorResponse: getErrorResponseMock,
      }),
    ).toEqual(serializedErrorObj);
  });
});
