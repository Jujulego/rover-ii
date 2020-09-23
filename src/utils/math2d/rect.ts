import { ArgsArray } from '../types';

import { ISize, parseSizeArgs, SizeArgs } from './size';
import { VectorArgs, parseVectorArgs, IVector } from './vector';

// Types
export interface IRect {
  t: number;
  l: number;
  b: number;
  r: number;
}

export type RectArgs<R extends Array<any> = [], O extends Array<any> = []>
  = ArgsArray<[IRect, ...R], O> | ArgsArray<[number, number, number, number, ...R], O>;

// Utils
export function parseRectArgs<R extends Array<any>, O extends Array<any>>(args: RectArgs<R, O>): ArgsArray<[IRect, ...R], O> {
  if (typeof args[0] === 'object') {
    return args as ArgsArray<[IRect, ...R], O>;
  }

  if (args[1] !== undefined && args[2] !== undefined && args[3] !== undefined) {
    const [t, l, b, r, ...others] = args as ArgsArray<[number, number, number, number, ...R], O>;
    return [{ t, l, b, r }, ...others];
  }

  throw new Error('If arg1 is a number, arg2, arg3 and arg4 must be defined !');
}

export function isRect(obj: any): obj is IRect {
  if (typeof obj === 'object') {
    return typeof obj.t === 'number'
      && typeof obj.l === 'number'
      && typeof obj.b === 'number'
      && typeof obj.r === 'number';
  }

  return false;
}

// Class
export class Rect implements IRect {
  // Attributes
  public t: number;
  public l: number;
  public b: number;
  public r: number;

  // Constructor
  constructor(r: IRect);
  constructor(t: number, l: number, b: number, r: number);
  constructor(...args: RectArgs) {
    const [{ t, l, b, r }] = parseRectArgs(args);
    this.t = t;
    this.l = l;
    this.b = b;
    this.r = r;
  }

  // Static methods
  static fromVectors(u: IVector, v: IVector): Rect;
  static fromVectors(xu: number, yu: number, v: IVector): Rect;
  static fromVectors(u: IVector, xv: number, yv: number): Rect;
  static fromVectors(xu: number, yu: number, xv: number, yv: number): Rect;
  static fromVectors(...args: VectorArgs<VectorArgs>): Rect {
    const [u, ...others] = parseVectorArgs(args);
    const [v] = parseVectorArgs(others);

    return new Rect(
      Math.min(u.y, v.y),
      Math.min(u.x, u.x),
      Math.max(u.y, v.y),
      Math.max(u.x, v.x),
    );
  }

  static fromVectorSize(u: IVector, s: ISize): Rect;
  static fromVectorSize(x: number, y: number, s: ISize): Rect;
  static fromVectorSize(u: IVector, w: number, h: number): Rect;
  static fromVectorSize(x: number, y: number, w: number, h: number): Rect;
  static fromVectorSize(...args: VectorArgs<SizeArgs>): Rect {
    const [u, ...others] = parseVectorArgs(args);
    const [s] = parseSizeArgs(others);

    return new Rect(u.y, u.x, u.y + s.h, u.x + s.w);
  }

  // Methods
  within(r: IRect): boolean;
  within(t: number, l: number, b: number, r: number): boolean;
  within(...args: RectArgs): boolean {
    const [r] = parseRectArgs(args);

    return this.l >= r.l && this.r <= r.r && this.t >= r.t && this.b <= r.b;
  }
}

// Constants
export const NULL_RECT = new Rect(0, 0, 0, 0);
