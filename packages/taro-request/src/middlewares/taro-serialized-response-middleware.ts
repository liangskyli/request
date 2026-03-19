import type { SerializedResponseConfig } from '@liangskyli/request';
import { serializedResponseMiddleware } from '@liangskyli/request';

export type TaroSerializedResponseConfig<
  CodeKey extends string = string,
  DataKey extends string = string,
  CodeKeyType extends string | number = string,
> = SerializedResponseConfig<CodeKey, DataKey, CodeKeyType>;

export function taroSerializedResponseMiddleware<
  CodeKey extends string = string,
  DataKey extends string = string,
  CodeKeyType extends string | number = string,
>(
  option: TaroSerializedResponseConfig<CodeKey, DataKey, CodeKeyType> = {},
): ReturnType<typeof serializedResponseMiddleware> {
  const middleware = serializedResponseMiddleware(option);

  return async (ctx, next) => {
    if (ctx.success) {
      // taro statusCode !== 200, need set success false
      const statusCode = ctx.response?.statusCode;
      const isStatusCodeOk = statusCode === 200;
      if (!isStatusCodeOk) {
        ctx.success = false;
        ctx.error = ctx.response;
      }
    }

    return middleware(ctx, next);
  };
}
