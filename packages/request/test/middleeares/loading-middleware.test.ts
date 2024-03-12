import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { loadingMiddleware } from '../../src';

describe('loadingMiddleware file', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  test('loadingMiddleware', async () => {
    const showLoadingMock = vi.fn();
    const hideLoadingMock = vi.fn();
    const nextMock = vi.fn();
    const loadingMiddlewareObj = loadingMiddleware({
      showLoading: showLoadingMock,
      hideLoading: hideLoadingMock,
    });
    await loadingMiddlewareObj(
      {
        config: {
          customOptions: {
            loadingEnabled: false,
          },
        },
        success: true,
      },
      nextMock,
    );
    expect(showLoadingMock).toBeCalledTimes(0);
    expect(hideLoadingMock).toBeCalledTimes(0);
    expect(nextMock).toBeCalledTimes(1);

    nextMock.mockClear();
    await loadingMiddlewareObj(
      {
        config: {
          customOptions: {
            loadingEnabled: true,
          },
        },
        success: true,
      },
      nextMock,
    );
    expect(showLoadingMock).toBeCalledTimes(1);
    expect(hideLoadingMock).toBeCalledTimes(1);
    expect(nextMock).toBeCalledTimes(1);

    // hideLoadingNextTick
    showLoadingMock.mockClear();
    hideLoadingMock.mockClear();
    nextMock.mockClear();
    const loadingMiddlewareObj2 = loadingMiddleware({
      showLoading: showLoadingMock,
      hideLoading: hideLoadingMock,
      hideLoadingNextTick: true,
    });
    await loadingMiddlewareObj2(
      {
        config: {
          customOptions: {
            loadingEnabled: true,
          },
        },
        success: true,
      },
      nextMock,
    );
    vi.advanceTimersByTime(100);
    expect(showLoadingMock).toBeCalledTimes(1);
    expect(hideLoadingMock).toBeCalledTimes(1);
    expect(nextMock).toBeCalledTimes(1);

    // throw error
    showLoadingMock.mockClear();
    hideLoadingMock.mockClear();
    nextMock.mockClear();

    await expect(
      loadingMiddlewareObj2(
        {
          config: {
            customOptions: {
              loadingEnabled: true,
            },
          },
          success: true,
        },
        () => {
          return Promise.reject('error');
        },
      ),
    ).rejects.toEqual('error');
    vi.advanceTimersByTime(100);
    expect(showLoadingMock).toBeCalledTimes(1);
    expect(hideLoadingMock).toBeCalledTimes(1);
  });
});
