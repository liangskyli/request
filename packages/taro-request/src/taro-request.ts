import type {
  LoadingConfig,
  LoadingOption,
  SerializedResponseConfig,
  ShowErrorConfig,
  ShowErrorOption,
} from '@liangskyli/request';
import {
  loadingMiddleware,
  serializedResponseMiddleware,
  showErrorMiddleware,
} from '@liangskyli/request';
import type { IPriority } from '@liangskyli/request/lib/middleware-manager';
import type Taro from '@tarojs/taro';
import { taroSerializedErrorMiddleware } from './middlewares';
import { taroCreateRequest } from './taro-create-request';

type BaseTaroRequestConfig = Taro.request.Option;
export type IRequestConfig = BaseTaroRequestConfig &
  LoadingOption &
  ShowErrorOption;
type IAxiosRequestOpts = {
  initConfig?: IRequestConfig;
  loadingMiddlewareConfig?: LoadingConfig;
  /** loadingMiddleware priority, default: -100 */
  loadingMiddlewarePriority?: Required<IPriority>['priority'];
  serializedResponseMiddlewareConfig?: SerializedResponseConfig;
  /** serializedResponseMiddleware priority, default: -100 */
  serializedResponseMiddlewarePriority?: Required<IPriority>['priority'];
  axiosSerializedErrorMiddlewareConfig?: Parameters<
    typeof taroSerializedErrorMiddleware
  >[0];
  /** taroSerializedErrorMiddleware priority, default: 100 */
  axiosSerializedErrorMiddlewarePriority?: Required<IPriority>['priority'];
  ShowErrorMiddlewareConfig: ShowErrorConfig;
  /** showErrorMiddleware priority, default: -99 */
  showErrorMiddlewarePriority?: Required<IPriority>['priority'];
};
export const axiosRequest = <
  T extends Record<string, any> = Record<string, any>,
>(
  opts: IAxiosRequestOpts,
) => {
  const {
    initConfig,
    loadingMiddlewareConfig,
    serializedResponseMiddlewareConfig = {},
    axiosSerializedErrorMiddlewareConfig = {},
    ShowErrorMiddlewareConfig,
    loadingMiddlewarePriority,
    showErrorMiddlewarePriority,
    axiosSerializedErrorMiddlewarePriority,
    serializedResponseMiddlewarePriority,
  } = opts;
  const request = taroCreateRequest<IRequestConfig, T>(initConfig);

  // request middlewares
  request.middlewares.request.use(loadingMiddleware(loadingMiddlewareConfig), {
    priority: loadingMiddlewarePriority ?? -100,
  });
  request.middlewares.request.use(
    showErrorMiddleware(ShowErrorMiddlewareConfig),
    { priority: showErrorMiddlewarePriority ?? -99 },
  );
  request.middlewares.request.use(
    taroSerializedErrorMiddleware(axiosSerializedErrorMiddlewareConfig),
    { priority: axiosSerializedErrorMiddlewarePriority ?? 100 },
  );

  // response middlewares
  request.middlewares.response.use(
    serializedResponseMiddleware(serializedResponseMiddlewareConfig),
    { priority: serializedResponseMiddlewarePriority ?? -100 },
  );

  return request;
};
