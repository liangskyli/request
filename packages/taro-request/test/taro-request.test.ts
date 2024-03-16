import { afterEach, describe, expect, test, vi } from 'vitest';
import { taroRequest } from '../src';

vi.mock('@tarojs/taro', () => {
  return {
    default: {
      request: (options: any) => {
        let result: Record<string, any> = {
          retCode: '0',
          data: 'get success',
        };
        if (options.url === '/test-err1') {
          result = {
            retCode: '10',
            retMsg: 'retMsg',
          };
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
  });
});
