import MockAdapter from 'axios-mock-adapter';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { axiosCreateRequest } from '../src';

describe('axiosCreateRequest file', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  test('axiosCreateRequest', async () => {
    const request = axiosCreateRequest();
    const mock = new MockAdapter(request as any);
    mock.onGet('/base/test').reply(200, { data: 'get base success' });
    mock.onGet('/test').reply(200, 'get success');
    mock.onPost('/base/test').reply(200, 'post base success');
    mock.onPost('/test').reply(200, 'post success');

    await expect(
      request({ baseURL: '/base', url: '/test' }),
    ).resolves.toMatchObject({
      config: {
        baseURL: '/base',
        url: '/test',
        method: 'get',
      },
      status: 200,
      data: { data: 'get base success' },
    });
    await expect(
      request.request({ url: '/test', params: { a: 1 }, method: 'get' }),
    ).resolves.toMatchObject({
      config: {
        url: '/test',
        method: 'get',
        params: { a: 1 },
      },
      status: 200,
      data: 'get success',
    });
    await expect(
      request.request({ url: '/test', method: 'post' }),
    ).resolves.toMatchObject({
      config: {
        url: '/test',
        method: 'post',
      },
      status: 200,
      data: 'post success',
    });
    await expect(
      request.createApi()({})({
        baseURL: '/base',
        url: '/test',
        method: 'post',
        data: { a: 1 },
      }),
    ).resolves.toMatchObject({
      config: {
        baseURL: '/base',
        url: '/test',
        method: 'post',
        data: '{"a":1}',
      },
      status: 200,
      data: 'post base success',
    });
  });
});
