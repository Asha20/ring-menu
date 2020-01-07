import { Dynamic } from "../parts/parts";

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

export function isDynamic<T>(x: T | Dynamic): x is Dynamic {
  return typeof x === "object" && (x as Dynamic).__dynamic === true;
}

export function matchTuple<T>(pairs: Array<[Function[], () => T]>) {
  return function _matchTuple(xs: any[]) {
    for (const [tests, val] of pairs) {
      if (xs.length === tests.length && xs.every((x, i) => tests[i](x))) {
        return val();
      }
    }
    throw new Error("Not all code paths return a value.");
  };
}
