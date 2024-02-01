import {Coord} from '../shared/types';

export function deepCopyObject<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function withoutItems<T>(arr: Array<T>, items: Array<T>): Array<T> {
  return arr.filter((value: T) => {
    !items.includes(value);
  });
}

export function withItems<T>(arr: Array<T>, items: Array<T>): Array<T> {
  return [...new Set(arr.concat(items))];
}

export function areCoordsEqual(c1: Coord, c2: Coord) {
  return c1.c === c2.c && c1.r === c2.r;
}
