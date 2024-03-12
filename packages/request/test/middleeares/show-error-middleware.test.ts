import { afterEach, describe, expect, test, vi } from 'vitest';
import { showErrorMiddleware } from '../../src';

describe('showErrorMiddleware file', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  test('showErrorMiddleware, default config', async () => {
    const handleErrorMock = vi.fn();
    const showErrorMock = vi.fn();
    const nextMock = vi.fn();
    const showErrorMiddlewareObj = showErrorMiddleware({
      handleError: handleErrorMock,
      showError: showErrorMock,
    });
    await showErrorMiddlewareObj({ config: {}, success: true }, nextMock);
    expect(nextMock).toBeCalledTimes(1);
    expect(handleErrorMock).toBeCalledTimes(0);
    expect(showErrorMock).toBeCalledTimes(0);

    // success false
    nextMock.mockClear();
    handleErrorMock.mockClear();
    showErrorMock.mockClear();
    await showErrorMiddlewareObj({ config: {}, success: false }, nextMock);
    expect(nextMock).toBeCalledTimes(1);
    expect(handleErrorMock).toBeCalledTimes(1);
    expect(showErrorMock).toBeCalledTimes(1);
  });
  test('showErrorMiddleware, custom config', async () => {
    const handleErrorMock = vi.fn();
    const showErrorMock = vi.fn();
    const nextMock = vi.fn();
    const showErrorMiddlewareObj = showErrorMiddleware({
      enable: false,
      handleError: handleErrorMock,
      showError: showErrorMock,
    });
    const configShowErrorMock = vi.fn();
    await showErrorMiddlewareObj(
      {
        config: { customOptions: { showError: configShowErrorMock } },
        success: false,
      },
      nextMock,
    );
    expect(nextMock).toBeCalledTimes(1);
    expect(handleErrorMock).toBeCalledTimes(1);
    expect(showErrorMock).toBeCalledTimes(0);
    expect(configShowErrorMock).toBeCalledTimes(0);

    // showErrorEnabled
    nextMock.mockClear();
    handleErrorMock.mockClear();
    showErrorMock.mockClear();
    configShowErrorMock.mockClear();
    await showErrorMiddlewareObj(
      {
        config: {
          customOptions: {
            showErrorEnabled: true,
            showError: configShowErrorMock,
          },
        },
        success: false,
      },
      nextMock,
    );
    expect(nextMock).toBeCalledTimes(1);
    expect(handleErrorMock).toBeCalledTimes(1);
    expect(showErrorMock).toBeCalledTimes(0);
    expect(configShowErrorMock).toBeCalledTimes(1);
  });
  test('showErrorMiddleware, throw error', async () => {
    const handleErrorMock = vi.fn();
    const showErrorMock = vi.fn();
    const showErrorMiddlewareObj = showErrorMiddleware({
      handleError: handleErrorMock,
      showError: showErrorMock,
    });
    await expect(
      showErrorMiddlewareObj(
        {
          config: {},
          success: false,
        },
        () => {
          return Promise.reject('error');
        },
      ),
    ).rejects.toBe('error');
    expect(handleErrorMock).toBeCalledTimes(1);
    expect(showErrorMock).toBeCalledTimes(1);
  });
});
