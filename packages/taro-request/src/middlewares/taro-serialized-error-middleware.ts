import type { SerializedErrorConfig } from '@liangskyli/request';
import { serializedErrorMiddleware } from '@liangskyli/request';

export type TaroSerializedErrorConfig<
  CodeKey extends string,
  MessageKey extends string,
> = Omit<
  SerializedErrorConfig<CodeKey, MessageKey>,
  'checkIsCancel' | 'getErrorResponse'
>;

export function taroSerializedErrorMiddleware<
  CodeKey extends string,
  MessageKey extends string,
>(
  option: TaroSerializedErrorConfig<CodeKey, MessageKey>,
): ReturnType<typeof serializedErrorMiddleware> {
  return serializedErrorMiddleware({
    ...option,
    checkIsCancel(error) {
      // return false uniformly without determining whether it is a cancel request
      console.log('checkIsCancel:', error);
      return false;
    },
    getErrorResponse(error) {
      if (error?.statusCode !== 404 && error?.data) {
        return error.data;
      }
      return error;
    },
  });
}
