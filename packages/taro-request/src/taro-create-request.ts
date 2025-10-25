import type { FirstParamType, PromiseReturnType } from '@liangskyli/request';
import { createRequest } from '@liangskyli/request';
import Taro from '@tarojs/taro';

const request: (config: Taro.request.Option) => Promise<any> = (config) =>
  Taro.request(config);

export const taroCreateRequest = <
  IF extends typeof request = typeof request,
  IC extends FirstParamType<IF> = FirstParamType<IF>,
  IR = PromiseReturnType<IF>,
>(
  initConfig?: Partial<IC>,
) => createRequest<IF, IC, IR>(request as IF, initConfig);
