import type { Middleware } from './compose-middleware';

export type IPriority = {
  /** middlewares priority, default: 0 */
  priority?: number;
};
type IMiddlewares<T> = (
  | ({
      middleware: Middleware<T>;
    } & Required<IPriority>)
  | null
)[];
export class MiddlewareManager<T = any> {
  private _middlewares: IMiddlewares<T> = [];
  get middlewares() {
    return this._middlewares.filter(
      (_): _ is NonNullable<IMiddlewares<T>[number]> => _ !== null,
    );
  }
  use<TT extends T = T>(middleware: Middleware<TT>, config?: IPriority) {
    this._middlewares.push({
      middleware: middleware as Middleware<T>,
      priority: config?.priority ?? 0,
    });
    return this._middlewares.length - 1;
  }
  eject(id: number): void {
    if (this._middlewares[id]) {
      this._middlewares[id] = null;
    }
  }
}
