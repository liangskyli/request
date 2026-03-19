import type {
  IPriority,
  LoadingConfig,
  LoadingOption,
  SerializedError,
  SerializedResponseOption,
  ShowErrorConfig,
  ShowErrorOption,
} from '@liangskyli/request';
import { loadingMiddleware, showErrorMiddleware } from '@liangskyli/request';
import type Taro from '@tarojs/taro';
import type { TaroSerializedResponseConfig } from './middlewares';
import {
  taroSerializedErrorMiddleware,
  taroSerializedResponseMiddleware,
} from './middlewares';
import { taroCreateRequest } from './taro-create-request';

type BaseTaroRequestConfig = Taro.request.Option;
export type IRequestConfig<
  T extends Record<string, any> = Record<string, any>,
  CodeKey extends keyof T = string,
  MessageKey extends keyof T = string,
  CodeKeyType extends string | number = string,
> = BaseTaroRequestConfig &
  LoadingOption &
  SerializedResponseOption &
  ShowErrorOption<
    BaseTaroRequestConfig &
      LoadingOption &
      SerializedResponseOption &
      ShowErrorOption,
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
  serializedResponseMiddlewareConfig?: TaroSerializedResponseConfig<
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
  type TaroCreateRequestFn = (
    config: IRequestConfig<T, CodeKey, MessageKey, CodeKeyType>,
  ) => Promise<T>;
  const request = taroCreateRequest<
    TaroCreateRequestFn,
    IRequestConfig<T, CodeKey, MessageKey, CodeKeyType>,
    T
  >(initConfig);

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
    taroSerializedResponseMiddleware(serializedResponseMiddlewareConfig),
    { priority: serializedResponseMiddlewarePriority ?? -100 },
  );

  return request;
};
