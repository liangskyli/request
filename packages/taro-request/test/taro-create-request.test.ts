import { afterEach, describe, expect, test, vi } from 'vitest';
import { taroCreateRequest } from '../src';

vi.mock('@tarojs/taro', () => {
  return {
    default: {
      request: () => {
        return {
          retCode: '0',
          data: 'get success',
        };
      },
    },
  };
});
describe('taroCreateRequest file', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  test('taroCreateRequest', async () => {
    const request = taroCreateRequest();

    await expect(request({ url: '/test' })).resolves.toMatchObject({
      retCode: '0',
      data: 'get success',
    });
  });
});
