import _ from 'lodash';
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

export function isValidInput(input: string) {
  if (input === '') {
    return false;
  }
  for (const char of input) {
    if (!isValidChar(char)) {
      return false;
    }
  }
  return true;
}

const VALID_SYMBOLS = '!@#$%^&*()-+=`~/?\\'; // special theme puzzles have these sometimes;

export function isValidChar(char: string) {
  if (VALID_SYMBOLS.indexOf(char) !== -1) {
    return true;
  }
  return char.match(/^[A-Z0-9]$/);
}
