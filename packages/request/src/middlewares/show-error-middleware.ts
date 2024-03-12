import type { Middleware } from '../compose-middleware';
import type { Context } from '../context';

export type ShowErrorConfig = {
  /** 是否启动全局showError，默认开启 */
  enable?: boolean;
  /** 发生错误时执行，`return false`可阻止后续的showError函数执行 */
  handleError?: (err: any, ctx: Context) => void | false;
  /** cancel时不会触发 */
  showError: (err: any, ctx: Context) => void;
};
export type ShowErrorOption = {
  customOptions?: {
    /** is show error enabled，default: ShowErrorConfig.enable */
    showErrorEnabled?: boolean;
    /** 可替换全局showError,default: ShowErrorConfig.showError */
    showError?: (err: any, ctx: Context) => void;
  };
};
export function showErrorMiddleware(
  option: ShowErrorConfig,
): Middleware<Context<ShowErrorOption>> {
  const { showError, handleError, enable = true } = option;
  return async (ctx, next) => {
    const {
      customOptions: {
        showErrorEnabled: isShowError = enable,
        showError: requestShowError,
      } = {},
    } = ctx.config as ShowErrorOption;
    function runError(err: any, ctx: Context) {
      const bool = handleError?.(err, ctx);
      if (bool !== false) {
        if (isShowError) {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          requestShowError ? requestShowError(err, ctx) : showError(err, ctx);
        }
      }
    }
    try {
      await next();
      if (!ctx.success) {
        runError(ctx.error, ctx);
      }
    } catch (error) {
      runError(error, ctx);
      throw error;
    }
  };
}
