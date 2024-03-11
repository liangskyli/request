import type { Middleware } from '../compose-middleware';
import type { Context } from '../context';

export type SerializedResponseConfig = {
  /** default: retCode */
  serializedResponseCodeKey?: string;
  /** serialization response success code value, default: 0 */
  serializedResponseSuccessCode?: string;
};
export const serializedResponseMiddleware = (
  option: SerializedResponseConfig = {},
): Middleware<Context> => {
  const codeKey = option.serializedResponseCodeKey ?? 'retCode';
  const code = option.serializedResponseSuccessCode ?? '0';
  return async (ctx, next) => {
    await next();
    if (ctx.success) {
      const { data } = ctx.response || {};
      const value = data?.[codeKey];
      const retCode = typeof value === 'undefined' ? '' : `${value}`;
      if (retCode === code) {
        ctx.response = data;
      } else {
        ctx.success = false;
        ctx.error = data ?? ctx.response;
      }
    }
  };
};
