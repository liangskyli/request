import type { Middleware } from '../compose-middleware';
import type { Context } from '../context';

export function getFirstPropertyValueToString(
  data: Record<string, any>,
  keys: string[],
): string {
  const values = keys.map((key) => data?.[key]);
  let result = [...values, ''].find((v) => typeof v !== 'undefined');
  result = `${result}`;
  return result;
}
type SerializedError<CodeKey extends string, MessageKey extends string> = {
  readonly _isSerializedError: boolean;
  aborted?: boolean;
  _reason: any;
} & Record<CodeKey, string> &
  Record<MessageKey, string>;
export type SerializedErrorConfig<
  CodeKey extends string,
  MessageKey extends string,
> = {
  /** default: retCode */
  serializedErrorCodeKey?: CodeKey;
  /** default: retMsg */
  serializedErrorMessageKey?: MessageKey;
  /** response code key，default: ['retCode', 'code', 'status'] */
  responseCodeKey?: string[];
  /** response message key，default: ['retMsg', 'message', 'statusText']*/
  responseMessageKey?: string[];
  checkIsCancel: (error: any) => boolean;
  getErrorResponse: (error: any) => Record<string, any>;
  /** message conversion */
  messageMap?: Record<string, string>;
  /** default return message info, default: 未知错误，请稍后再试 */
  defaultReturnMessageInfo?: string;
};
const serializedError = <
  CodeKey extends string = 'retCode',
  MessageKey extends string = 'retMsg',
>(
  error: any,
  option: SerializedErrorConfig<CodeKey, MessageKey>,
): SerializedError<CodeKey, MessageKey> => {
  if (error && error._isSerializedError === true) {
    return error;
  }
  const {
    checkIsCancel,
    getErrorResponse,
    messageMap,
    defaultReturnMessageInfo = '未知错误，请稍后再试',
    ...rest
  } = option;
  const retCodeKey = rest.serializedErrorCodeKey || 'retCode';
  const retMsgKey = rest.serializedErrorMessageKey || 'retMsg';
  const responseCodeKey = rest.responseCodeKey || ['retCode', 'code', 'status'];
  const responseMessageKey = rest.responseMessageKey || [
    'retMsg',
    'message',
    'statusText',
  ];

  const res: SerializedError<string, string> = {
    _isSerializedError: true,
    [retCodeKey]: '',
    [retMsgKey]: '',
    aborted: checkIsCancel(error),
    _reason: error,
  };

  const response = getErrorResponse(error);
  res[retCodeKey] = getFirstPropertyValueToString(response, responseCodeKey);
  res[retMsgKey] = getFirstPropertyValueToString(response, responseMessageKey);

  const msgMap: Record<string, string> = {
    ['Network Error']: '网络错误，请检查网络配置',
    ['ECONNABORTED']: '网络超时，请稍后再试',
    ...messageMap,
  };
  res[retMsgKey] =
    (msgMap[res[retMsgKey]] ?? res[retMsgKey]) || defaultReturnMessageInfo;

  return res;
};
export const serializedErrorMiddleware = <
  CodeKey extends string,
  MessageKey extends string,
>(
  option: SerializedErrorConfig<CodeKey, MessageKey>,
): Middleware<Context> => {
  return async (ctx, next) => {
    try {
      await next();
      if (!ctx.success) {
        ctx.error = serializedError<CodeKey, MessageKey>(ctx.error, option);
      }
      return ctx;
    } catch (error) {
      throw serializedError<CodeKey, MessageKey>(error, option);
    }
  };
};
