import type { Middleware } from '../compose-middleware';
import type { Context } from '../context';

export type SerializedResponseConfig = {
  /** default: retCode */
  serializedResponseCodeKey?: string;
  /** serialization response success code value, default: '0' */
  serializedResponseSuccessCode?: string | number;
  /**
   * when response data is string, it will transform to obj with data key
   * serialization response data key
   * default: data
   * */
  serializedResponseDataKey?: string;
};
export const serializedResponseMiddleware = (
  option: SerializedResponseConfig = {},
): Middleware<Context> => {
  const codeKey = option.serializedResponseCodeKey ?? 'retCode';
  const code = option.serializedResponseSuccessCode ?? '0';
  const dataKey = option.serializedResponseDataKey ?? 'data';
  return async (ctx, next) => {
    if (ctx.success) {
      let { data } = ctx.response || {};
      // taro use statusCode
      const statusCode = ctx.response?.statusCode ?? 200;
      const isStatusCodeOk = statusCode === 200;

      if (isStatusCodeOk && typeof data === 'string') {
        // string to obj, data filed
        data = { [codeKey]: code, [dataKey]: data };
      }
      const retCode = data?.[codeKey];
      if (isStatusCodeOk && retCode === code) {
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
