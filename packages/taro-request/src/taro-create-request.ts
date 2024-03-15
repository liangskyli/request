import type { FirstParamType, PromiseReturnType } from '@liangskyli/request';
import { createRequest } from '@liangskyli/request';
import Taro from '@tarojs/taro';

type IF = typeof Taro.request;
export const taroCreateRequest = <
  IC extends FirstParamType<IF> = FirstParamType<IF>,
  IR = PromiseReturnType<IF>,
>(
  initConfig?: Partial<IC>,
) => createRequest<IF, IC, IR>(Taro.request, initConfig);
