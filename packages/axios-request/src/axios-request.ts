import type {
  LoadingConfig,
  LoadingOption,
  SerializedError,
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
import { axiosCreateRequest } from './axios-create-request';
import { axiosSerializedErrorMiddleware } from './middlewares';

type BaseAxiosRequestConfig = Parameters<typeof axiosCreateRequest>[0];

export type IRequestConfig<
  T extends Record<string, any> = Record<string, any>,
  CodeKey extends keyof T = string,
  MessageKey extends keyof T = string,
  CodeKeyType extends string | number = string,
> = BaseAxiosRequestConfig &
  LoadingOption &
  ShowErrorOption<
    BaseAxiosRequestConfig & LoadingOption & ShowErrorOption,
    T,
    SerializedError<
      Extract<CodeKey, string>,
      Extract<MessageKey, string>,
      CodeKeyType
    >
  >;
type IAxiosRequestOpts<
  T extends Record<string, any> = Record<string, any>,
  CodeKey extends keyof T = string,
  MessageKey extends keyof T = string,
  DataKey extends keyof T = string,
  CodeKeyType extends string | number = string,
> = {
  initConfig?: IRequestConfig<T, CodeKey, MessageKey>;
  loadingMiddlewareConfig?: LoadingConfig;
  /** loadingMiddleware priority, default: -100 */
  loadingMiddlewarePriority?: Required<IPriority>['priority'];
  serializedResponseMiddlewareConfig?: SerializedResponseConfig<
    Extract<CodeKey, string>,
    Extract<DataKey, string>,
    Extract<CodeKeyType, string | number>
  >;
  /** serializedResponseMiddleware priority, default: -100 */
  serializedResponseMiddlewarePriority?: Required<IPriority>['priority'];
  axiosSerializedErrorMiddlewareConfig?: Parameters<
    typeof axiosSerializedErrorMiddleware<
      Extract<CodeKey, string>,
      Extract<MessageKey, string>
    >
  >[0];
  /** axiosSerializedErrorMiddleware priority, default: 100 */
  axiosSerializedErrorMiddlewarePriority?: Required<IPriority>['priority'];
  ShowErrorMiddlewareConfig: ShowErrorConfig<
    IRequestConfig,
    T,
    SerializedError<
      Extract<CodeKey, string>,
      Extract<MessageKey, string>,
      CodeKeyType
    >
  >;
  /** showErrorMiddleware priority, default: -99 */
  showErrorMiddlewarePriority?: Required<IPriority>['priority'];
};
export const axiosRequest = <
  T extends Record<string, any> = Record<string, any>,
  CodeKey extends keyof T = string,
  MessageKey extends keyof T = string,
  DataKey extends keyof T = string,
  CodeKeyType extends string | number = string,
>(
  opts: IAxiosRequestOpts<T, CodeKey, MessageKey, DataKey, CodeKeyType>,
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
  const request = axiosCreateRequest<IRequestConfig<T>, T>(initConfig);

  // request middlewares
  request.middlewares.request.use(loadingMiddleware(loadingMiddlewareConfig), {
    priority: loadingMiddlewarePriority ?? -100,
  });
  request.middlewares.request.use(
    showErrorMiddleware(ShowErrorMiddlewareConfig),
    { priority: showErrorMiddlewarePriority ?? -99 },
  );
  request.middlewares.request.use(
    axiosSerializedErrorMiddleware(axiosSerializedErrorMiddlewareConfig),
    { priority: axiosSerializedErrorMiddlewarePriority ?? 100 },
  );

  // response middlewares
  request.middlewares.response.use(
    serializedResponseMiddleware(serializedResponseMiddlewareConfig),
    { priority: serializedResponseMiddlewarePriority ?? -100 },
  );

  return request;
};
