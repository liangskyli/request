import type { FirstParamType, PromiseReturnType } from '@liangskyli/request';
import { createRequest } from '@liangskyli/request';
import type { AxiosRequestConfig } from 'axios';
import axios from 'axios';

const request = (config: AxiosRequestConfig) => axios.create().request(config);
type IF = typeof request;
export const axiosCreateRequest = <
  IC extends FirstParamType<IF> = FirstParamType<IF>,
  IR = PromiseReturnType<IF>,
>(
  initConfig?: Partial<IC>,
) => createRequest<IF, IC, IR>(request, initConfig);
