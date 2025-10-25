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
import type Taro from '@tarojs/taro';
import { taroSerializedErrorMiddleware } from './middlewares';
import { taroCreateRequest } from './taro-create-request';

type BaseTaroRequestConfig = Taro.request.Option;
export type IRequestConfig<
  T extends Record<string, any> = Record<string, any>,
  CodeKey extends keyof T = string,
  MessageKey extends keyof T = string,
  CodeKeyType extends string | number = string,
> = BaseTaroRequestConfig &
  LoadingOption &
  ShowErrorOption<
    BaseTaroRequestConfig & LoadingOption & ShowErrorOption,
    T,
    SerializedError<
      Extract<CodeKey, string>,
      Extract<MessageKey, string>,
      CodeKeyType
    >
  >;
type ITaroRequestOpts<
  T extends Record<string, any> = Record<string, any>,
  CodeKey extends keyof T = string,
  MessageKey extends keyof T = string,
  DataKey extends keyof T = string,
  CodeKeyType extends string | number = string,
> = {
  initConfig?: Partial<IRequestConfig<T, CodeKey, MessageKey>>;
  loadingMiddlewareConfig?: LoadingConfig;
  /** loadingMiddleware priority, default: -100 */
  loadingMiddlewarePriority?: Required<IPriority>['priority'];
  serializedResponseMiddlewareConfig?: SerializedResponseConfig<
    Extract<CodeKey, string>,
    Extract<DataKey, string>,
    Extract<CodeKeyType, string>
  >;
  /** serializedResponseMiddleware priority, default: -100 */
  serializedResponseMiddlewarePriority?: Required<IPriority>['priority'];
  taroSerializedErrorMiddlewareConfig?: Parameters<
    typeof taroSerializedErrorMiddleware<
      Extract<CodeKey, string>,
      Extract<MessageKey, string>
    >
  >[0];
  /** taroSerializedErrorMiddleware priority, default: 100 */
  taroSerializedErrorMiddlewarePriority?: Required<IPriority>['priority'];
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
export const taroRequest = <
  T extends Record<string, any> = Record<string, any>,
  CodeKey extends keyof T = string,
  MessageKey extends keyof T = string,
  DataKey extends keyof T = string,
  CodeKeyType extends string | number = string,
>(
  opts: ITaroRequestOpts<T, CodeKey, MessageKey, DataKey, CodeKeyType>,
) => {
  const {
    initConfig,
    loadingMiddlewareConfig,
    serializedResponseMiddlewareConfig = {},
    taroSerializedErrorMiddlewareConfig = {},
    ShowErrorMiddlewareConfig,
    loadingMiddlewarePriority,
    showErrorMiddlewarePriority,
    taroSerializedErrorMiddlewarePriority,
    serializedResponseMiddlewarePriority,
  } = opts;
  const request = taroCreateRequest<IRequestConfig<T>, T>(initConfig);

  // request middlewares
  request.middlewares.request.use(loadingMiddleware(loadingMiddlewareConfig), {
    priority: loadingMiddlewarePriority ?? -100,
  });
  request.middlewares.request.use(
    showErrorMiddleware(ShowErrorMiddlewareConfig),
    { priority: showErrorMiddlewarePriority ?? -99 },
  );
  request.middlewares.request.use(
    taroSerializedErrorMiddleware(taroSerializedErrorMiddlewareConfig),
    { priority: taroSerializedErrorMiddlewarePriority ?? 100 },
  );

  // response middlewares
  request.middlewares.response.use(
    serializedResponseMiddleware(serializedResponseMiddlewareConfig),
    { priority: serializedResponseMiddlewarePriority ?? -100 },
  );

  return request;
};
