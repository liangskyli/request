import type { Middleware } from './compose-middleware';

export class MiddlewareManager<T = any> {
  private _middlewares: ({
    middleware: Middleware<T>;
    priority: number;
  } | null)[] = [];
  get middlewares() {
    return this._middlewares.filter(
      (
        _,
      ): _ is {
        middleware: Middleware<T>;
        priority: number;
      } => _ !== null,
    );
  }
  use<TT extends T = T>(
    middleware: Middleware<TT>,
    config?: { priority?: number },
  ) {
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
