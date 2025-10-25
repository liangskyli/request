import type { Middleware } from '../compose-middleware';
import type { Context } from '../context';

export type SerializedResponseConfig<
  CodeKey extends string = string,
  DataKey extends string = string,
  CodeKeyType extends string | number = string,
> = {
  /** default: retCode */
  serializedResponseCodeKey?: CodeKey;
  /** serialization response success code value, default: '0' */
  serializedResponseSuccessCode?: CodeKeyType;
  /**
   * when response data is string, it will transform to obj with data key
   * serialization response data key
   * default: data
   * */
  serializedResponseDataKey?: DataKey;
};
export const serializedResponseMiddleware = <
  CodeKey extends string = string,
  DataKey extends string = string,
  CodeKeyType extends string | number = string,
>(
  option: SerializedResponseConfig<CodeKey, DataKey, CodeKeyType> = {},
): Middleware<Context> => {
  const codeKey = option.serializedResponseCodeKey ?? 'retCode';
  const successCode = option.serializedResponseSuccessCode ?? '0';
  const dataKey = option.serializedResponseDataKey ?? 'data';
  return async (ctx, next) => {
    if (ctx.success) {
      let { data } = ctx.response || {};
      // taro use statusCode
      const statusCode = ctx.response?.statusCode ?? 200;
      const isStatusCodeOk = statusCode === 200;

      if (isStatusCodeOk && typeof data === 'string') {
        // string to obj, data filed
        data = { [codeKey]: successCode, [dataKey]: data };
      }
      const retCode = data?.[codeKey];
      if (isStatusCodeOk && retCode === successCode) {
        ctx.response = data;
      } else {
        ctx.success = false;
        ctx.error = ctx.response;
      }
    }
    await next();
    return ctx;
  };
};
