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
   * serialization response data key
   * default: data
   * when response data is string and isResponseStringSerializedObj is true, it will transform to obj with data key
   * */
  serializedResponseDataKey?: DataKey;
  /**
   * is Response string or ReadableStream serialized to obj
   * default: false
   * */
  isResponseStringSerializedObj?: boolean;
};
export type SerializedResponseOption = {
  customOptions?: {
    /**
     * is Response string or ReadableStream serialized to obj
     * default：SerializedResponseConfig.isResponseStringSerializedObj
     * */
    isResponseStringSerializedObj?: boolean;
  };
};
export const serializedResponseMiddleware = <
  CodeKey extends string = string,
  DataKey extends string = string,
  CodeKeyType extends string | number = string,
>(
  option: SerializedResponseConfig<CodeKey, DataKey, CodeKeyType> = {},
): Middleware<Context<SerializedResponseOption>> => {
  const codeKey = option.serializedResponseCodeKey ?? 'retCode';
  const successCode = option.serializedResponseSuccessCode ?? '0';
  const dataKey = option.serializedResponseDataKey ?? 'data';
  const isGlobResponseStringSerializedObj =
    option.isResponseStringSerializedObj ?? false;
  return async (ctx, next) => {
    if (ctx.success) {
      const {
        customOptions: {
          isResponseStringSerializedObj = isGlobResponseStringSerializedObj,
        } = {},
      } = ctx.config;
      let { data } = ctx.response || {};
      let isSerializedObj = false;
      if (typeof data === 'string') {
        // string to obj, data filed
        data = { [codeKey]: successCode, [dataKey]: data };
        isSerializedObj = true;
      }
      if (
        data?.constructor?.name === 'ReadableStream' &&
        typeof data?.getReader === 'function'
      ) {
        // ReadableStream
        data = { [codeKey]: successCode, [dataKey]: data };
        isSerializedObj = true;
      }
      const retCode = data?.[codeKey];
      if (retCode === successCode) {
        ctx.response = data;
        if (!isResponseStringSerializedObj && isSerializedObj) {
          // raw response data
          ctx.response = data[dataKey];
        }
      } else {
        ctx.success = false;
        ctx.error = ctx.response;
      }
    }
    await next();
    return ctx;
  };
};
