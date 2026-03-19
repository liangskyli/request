import { afterEach, describe, expect, test, vi } from 'vitest';
import { taroRequest } from '../src';

vi.mock('@tarojs/taro', () => {
  return {
    default: {
      request: (options: any) => {
        let result: Record<string, any> = {
          statusCode: 200,
          data: {
            retCode: '0',
            data: 'get success',
          },
        };
        if (options.url === '/test-string') {
          result = {
            statusCode: 200,
            data: 'get string success',
          };
        }
        if (options.url === '/test-err1') {
          result = {
            statusCode: 200,
            data: {
              retCode: '10',
              retMsg: 'retMsg',
            },
          };
        }
        if (options.url === '/test-err2') {
          result = {
            statusCode: 500,
            errMsg: 'errMsg',
          };
        }
        if (options.url === '/test-err3') {
          throw Error('test-err3');
        }
        return result;
      },
    },
  };
});
describe('taroRequest file', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  test('taroRequest', async () => {
    const showLoadingMock = vi.fn();
    const hideLoadingMock = vi.fn();
    const showErrorMock = vi.fn();
    const request = taroRequest({
      loadingMiddlewareConfig: {
        showLoading: showLoadingMock,
        hideLoading: hideLoadingMock,
      },
      ShowErrorMiddlewareConfig: {
        showError: showErrorMock,
      },
    });

    await expect(request({ url: '/test' })).resolves.toMatchObject({
      retCode: '0',
      data: 'get success',
    });

    expect(showLoadingMock).toBeCalledTimes(1);
    expect(hideLoadingMock).toBeCalledTimes(1);
    expect(showErrorMock).toBeCalledTimes(0);

    await expect(request({ url: '/test-err1' })).rejects.toMatchObject({
      retCode: '10',
      retMsg: 'retMsg',
    });
    expect(showLoadingMock).toBeCalledTimes(2);
    expect(hideLoadingMock).toBeCalledTimes(2);
    expect(showErrorMock).toBeCalledTimes(1);

    await expect(request({ url: '/test-string' })).resolves.toEqual(
      'get string success',
    );
    await expect(
      request({
        url: '/test-string',
        customOptions: { isResponseStringSerializedObj: true },
      }),
    ).resolves.toMatchObject({
      retCode: '0',
      data: 'get string success',
    });

    await expect(request({ url: '/test-err2' })).rejects.toMatchObject({
      retCode: 500,
      retMsg: 'errMsg',
    });
    await expect(request({ url: '/test-err3' })).rejects.toMatchObject({
      retCode: undefined,
      retMsg: 'test-err3',
    });
  });
});
