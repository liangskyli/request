export type Next = () => Promise<any>;

export type Middleware<T> = (context: T, next: Next) => Promise<any>;

export type ComposedMiddleware<T> = (context: T, next?: Next) => Promise<any>;

/**
 * Compose `middleware` returning
 * a fully valid middleware comprised
 * of all those which are passed.
 * @param middleware
 */
export const composeMiddleware = <T>(
  middleware: Array<Middleware<T>>,
): ComposedMiddleware<T> => {
  if (!Array.isArray(middleware)) {
    throw new TypeError('Middleware stack must be an array!');
  }
  for (const fn of middleware) {
    if (typeof fn !== 'function') {
      throw new TypeError('Middleware must be composed of functions!');
    }
  }
  return function (context, next) {
    const dispatch: (i: number) => Promise<any> = (i) => {
      let fn: Middleware<T> | Next | undefined = middleware[i];
      if (i === middleware.length) {
        fn = next;
      }
      if (!fn) {
        return Promise.resolve();
      }
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    };
    return dispatch(0);
  };
};
