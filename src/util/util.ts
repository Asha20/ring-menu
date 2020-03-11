import * as is from "./is";

export type Brand<T, N> = T & { __brand: N };
export type NonEmptyArray<T> = T[] & { 0: T };
export type AnyObject = { [key: string]: any };

type Fn<A, B> = (x: A) => B;

export function count<T>(xs: T[], condition: Fn<T, boolean>) {
  return xs.reduce((acc, x) => (condition(x) ? acc + 1 : acc), 0);
}

export function sum(xs: number[]) {
  return xs.reduce((acc, x) => acc + x, 0);
}

export function map<U, T>(fn: Fn<T, U>) {
  return function _map(xs: T[]) {
    return xs.map(fn);
  };
}

export function filter<T>(fn: Fn<T, boolean>) {
  return function _filter(xs: T[]) {
    return xs.filter(fn);
  };
}

export function pipe<A, B>(initial: A, f1: Fn<A, B>): B;
export function pipe<A, B, C>(initial: A, f1: Fn<A, B>, f2: Fn<B, C>): C;
export function pipe(initial: any, ...fns: Function[]) {
  return fns.reduce((acc, fn) => fn(acc), initial);
}

export enum ArgumentType {
  Content = "content",
  Number = "number",
  Angle = "angle",
  Object = "object",
  Array = "array",
  Unknown = "unknown",
}

export function matchTuple<T>(pairs: Array<[ArgumentType[], () => T]>) {
  return function _matchTuple(xs: unknown[]) {
    const results: ArgumentType[] = [];

    const tests: Array<[Function, ArgumentType]> = [
      [is.content, ArgumentType.Content],
      [is.number, ArgumentType.Number],
      [is.angle, ArgumentType.Angle],
      [is.object, ArgumentType.Object],
      [is.array, ArgumentType.Array],
      [() => true, ArgumentType.Unknown],
    ];

    for (const item of xs) {
      for (const [test, x] of tests) {
        if (test(item)) {
          results.push(x);
          break;
        }
      }
    }

    for (const [shape, val] of pairs) {
      if (
        xs.length === shape.length &&
        results.every((x, i) => {
          if (x === ArgumentType.Number && shape[i] === ArgumentType.Angle) {
            return true;
          }
          return x === shape[i];
        })
      ) {
        return val();
      }
    }
    throw new Error("Unknown argument order was provided.");
  };
}
