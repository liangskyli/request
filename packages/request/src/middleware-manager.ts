import type { Middleware } from './compose-middleware';

export type IPriority = {
  /** middlewares priority, default: 0 */
  priority?: number;
};
export type IMiddlewares<T> = ({
  middleware: Middleware<T>;
} & Required<IPriority>)[];

export class MiddlewareManager<T = any> {
  private _middlewares: IMiddlewares<T> = [];
  get middlewares() {
    return this._middlewares;
  }
  use(middleware: Middleware<T>, config?: IPriority) {
    this._middlewares.push({
      middleware: middleware,
      priority: config?.priority ?? 0,
    });
    return this._middlewares.length - 1;
  }
  eject(id: number): void {
    if (this._middlewares[id]) {
      this._middlewares.splice(id, 1);
    }
  }
}
