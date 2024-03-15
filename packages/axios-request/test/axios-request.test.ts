import MockAdapter from 'axios-mock-adapter';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { axiosRequest } from '../src';

describe('axiosRequest file', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  test('axiosRequest default config', async () => {
    const showLoadingMock = vi.fn();
    const hideLoadingMock = vi.fn();
    const showErrorMock = vi.fn();
    const request = axiosRequest({
      loadingMiddlewareConfig: {
        showLoading: showLoadingMock,
        hideLoading: hideLoadingMock,
      },
      ShowErrorMiddlewareConfig: {
        showError: showErrorMock,
      },
    });
    const mock = new MockAdapter(request as any);
    mock.onGet('/test').reply(200, { retCode: '0', data: 'get success' });
    mock.onGet('/test-string').reply(200, 'get string success');
    mock.onGet('/test-err1').reply(200, { retCode: '10', retMsg: 'retMsg' });
    mock.onGet('/test-err2').reply(404);
    mock.onGet('/test-err3').networkError();

    await expect(request({ url: '/test' })).resolves.toMatchObject({
      retCode: '0',
      data: 'get success',
    });
    await expect(
      request({
        url: '/test-string',
        headers: {
          'Content-Type': 'text/html',
        },
      }),
    ).resolves.toMatchObject({
      retCode: '0',
      data: 'get string success',
    });
    await expect(request({ url: '/test-err1' })).rejects.toMatchObject({
      retCode: '10',
      retMsg: 'retMsg',
    });
    await expect(request({ url: '/test-err2' })).rejects.toMatchObject({
      retCode: '404',
      retMsg: '未知错误，请稍后再试',
    });
    await expect(request({ url: '/test-err3' })).rejects.toMatchObject({
      retMsg: '网络错误，请检查网络配置',
    });
  });
  test('axiosRequest custom config', async () => {
    const showLoadingMock = vi.fn();
    const hideLoadingMock = vi.fn();
    const showErrorMock = vi.fn();
    const request = axiosRequest({
      initConfig: { baseURL: '/v1' },
      loadingMiddlewareConfig: {
        showLoading: showLoadingMock,
        hideLoading: hideLoadingMock,
      },
      serializedResponseMiddlewareConfig: {
        serializedResponseCodeKey: 'code',
        serializedResponseSuccessCode: 0,
      },
      axiosSerializedErrorMiddlewareConfig: {
        serializedErrorCodeKey: 'code',
        serializedErrorMessageKey: 'msg',
        responseCodeKey: ['code', 'status'],
        responseMessageKey: ['msg', 'message', 'statusText'],
      },
      ShowErrorMiddlewareConfig: {
        showError: showErrorMock,
      },
    });
    const mock = new MockAdapter(request as any);
    mock.onPost('/v1/test').reply(200, { code: 0, data: 'post success' });
    mock.onPost('/v1/test-err1').reply(200, { code: 10, msg: 'msg' });

    await expect(
      request({ url: '/test', method: 'post' }),
    ).resolves.toMatchObject({
      code: 0,
      data: 'post success',
    });
    expect(showLoadingMock).toBeCalledTimes(1);
    expect(hideLoadingMock).toBeCalledTimes(1);
    expect(showErrorMock).toBeCalledTimes(0);
    await expect(
      request({ url: '/test-err1', method: 'post' }),
    ).rejects.toMatchObject({
      code: '10',
      msg: 'msg',
    });
    expect(showLoadingMock).toBeCalledTimes(2);
    expect(hideLoadingMock).toBeCalledTimes(2);
    expect(showErrorMock).toBeCalledTimes(1);
    expect(showErrorMock.mock.lastCall).toMatchObject([
      {
        code: '10',
        msg: 'msg',
      },
      {
        config: {
          baseURL: '/v1',
          method: 'post',
          url: '/test-err1',
        },
        success: false,
      },
    ]);
  });
});
