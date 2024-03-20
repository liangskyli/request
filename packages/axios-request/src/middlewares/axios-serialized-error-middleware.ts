import type { SerializedErrorConfig } from '@liangskyli/request';
import { serializedErrorMiddleware } from '@liangskyli/request';
import axios from 'axios';

export type AxiosSerializedErrorConfig<
  CodeKey extends string,
  MessageKey extends string,
> = Omit<
  SerializedErrorConfig<CodeKey, MessageKey>,
  'checkIsCancel' | 'getErrorResponse'
>;

export function axiosSerializedErrorMiddleware<
  CodeKey extends string,
  MessageKey extends string,
>(
  option: AxiosSerializedErrorConfig<CodeKey, MessageKey>,
): ReturnType<typeof serializedErrorMiddleware> {
  return serializedErrorMiddleware({
    ...option,
    checkIsCancel(error) {
      return axios.isCancel(error);
    },
    getErrorResponse(error) {
      return axios.isAxiosError(error) ? error.response || error : error.data;
    },
  });
}
