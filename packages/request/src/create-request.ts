import merge from 'deepmerge';
import type { Middleware } from './compose-middleware';
import { composeMiddleware } from './compose-middleware';
import type { Context } from './context';
import { createContext } from './context';
import { MiddlewareManager } from './middleware-manager';

export type FirstParamType<T extends (...args: any) => any> = T extends (
  firstParam: infer FP,
  ...args: any[]
) => any
  ? FP
  : any;
export type PromiseReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer PR
  ? PR extends Promise<infer R>
    ? R
    : PR
  : any;

export const createRequest = <
  IF extends (...args: any) => any,
  IC extends FirstParamType<IF> = FirstParamType<IF>,
  IR = PromiseReturnType<IF>,
>(
  requestFunction: IF,
  initConfig: Partial<IC> = {},
) => {
  const requestMiddlewareManager = new MiddlewareManager<Context<IC, IR>>();
  const responseMiddlewareManager = new MiddlewareManager<Context<IC, IR>>();
  const request = <R = IR, C extends IC = IC>(config: C) => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return commonRequest<R, C>(config);
  };
  request.defaults = merge<Partial<IC>>({}, initConfig);
  const commonRequest = async <R = IR, C extends IC = IC>(config: C) => {
    // 这里使用深拷贝保证每个请求的上下文唯一，防止参数的深度引用
    const ctx = createContext(merge(request.defaults, config));
    try {
      const requestMiddlewares = requestMiddlewareManager.middlewares
        .sort((a, b) => a.priority - b.priority)
        .map((_) => _.middleware);
      const responseMiddlewares = responseMiddlewareManager.middlewares
        .sort((a, b) => a.priority - b.priority)
        .map((_) => _.middleware);
      const requestHandler: Middleware<typeof ctx> = async (context, next) => {
        try {
          const response = await requestFunction(context.config);
          context.response = response;
          context.success = true;
        } catch (error) {
          context.error = error;
          context.success = false;
        }
        await next();
      };
      const composeRequest = composeMiddleware([
        ...requestMiddlewares,
        requestHandler,
        ...responseMiddlewares,
      ]);
      await composeRequest(ctx);
    } catch (error) {
      ctx.success = false;
      ctx.error = ctx.error ?? error;
    }
    if (ctx.success) {
      return ctx.response as R;
    } else {
      throw ctx.error;
    }
  };
  request.request = commonRequest;
  request.middlewares = {
    request: requestMiddlewareManager as Omit<
      typeof requestMiddlewareManager,
      'middlewares'
    >,
    response: responseMiddlewareManager as Omit<
      typeof requestMiddlewareManager,
      'middlewares'
    >,
  };
  request.createApi =
    <R = IR, C extends Partial<IC> = Partial<IC>>(initConfig?: Partial<IC>) =>
    <RR = R, CC extends Partial<IC> = C>(config: Partial<IC>) =>
    (option: Omit<Partial<IC>, keyof CC> & CC) =>
      commonRequest<RR>({
        ...initConfig,
        ...config,
        ...option,
      } as Required<CC>);

  return request;
};
