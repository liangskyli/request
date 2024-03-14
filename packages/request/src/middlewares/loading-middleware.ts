import type { Middleware } from '../compose-middleware';
import type { Context } from '../context';

export type LoadingConfig = {
  /** is global loading enabled, default: true */
  enable?: boolean;
  showLoading?: () => void;
  hideLoading?: () => void;
  /** is hide loading in next tick(for optimizing continuous loading display) */
  hideLoadingNextTick?: boolean;
};
export type LoadingOption = {
  customOptions?: {
    /** is loading enabled，default：LoadingConfig.enable */
    loadingEnabled?: boolean;
  };
};
let requestCount: number = 0;
let delayTimer: NodeJS.Timeout | number | undefined = undefined;
export const loadingMiddleware = (
  option: LoadingConfig = {},
): Middleware<Context<LoadingOption>> => {
  const {
    showLoading,
    hideLoading,
    enable = true,
    hideLoadingNextTick,
  } = option;
  const nextTickShowLoading = () => {
    function realShowLoading() {
      if (requestCount === 0) {
        showLoading?.();
      }
    }

    if (hideLoadingNextTick) {
      if (typeof delayTimer === 'undefined') {
        realShowLoading();
      }
    } else {
      realShowLoading();
    }
    requestCount += 1;
  };
  const nextTickHideLoading = () => {
    requestCount -= 1;
    requestCount = Math.max(requestCount, 0);
    function realHideLoading() {
      if (requestCount === 0) {
        hideLoading?.();
      }
    }

    if (hideLoadingNextTick) {
      clearTimeout(delayTimer);
      delayTimer = setTimeout(() => {
        delayTimer = undefined;
        realHideLoading();
      });
    } else {
      realHideLoading();
    }
  };
  return async (ctx, next) => {
    const { customOptions: { loadingEnabled: isShowLoading = enable } = {} } =
      ctx.config;
    if (isShowLoading) {
      nextTickShowLoading();
    }
    try {
      await next();
      if (isShowLoading) {
        nextTickHideLoading();
      }
    } catch (error) {
      if (isShowLoading) {
        nextTickHideLoading();
      }
      throw error;
    }
  };
};
