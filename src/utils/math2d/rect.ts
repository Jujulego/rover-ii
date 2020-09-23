import { ArgsArray } from '../types';

import { Size } from './size';
import { NULL_VECTOR, IVector, VectorArgs, parseVectorArgs } from './vector';

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
  static fromVectors(...args: VectorArgs<VectorArgs>): Rect {
    const [u, ...other] = parseVectorArgs(args);
    const [v] = parseVectorArgs(other);

    return new Rect(
      Math.min(u.y, v.y),
      Math.min(u.x, u.x),
      Math.max(u.y, v.y),
      Math.max(u.x, v.x),
    );
  }

  static fromVectorSize(...args: VectorArgs<[Size]>): Rect {
    const [u, s] = parseVectorArgs(args);
    return new Rect(u.y, u.x, u.y + s.h, u.x + s.w);
  }

  // Methods
  within(u: IVector | IRect): boolean {
    if (isRect(u)) {
      return u.l >= this.l && u.r <= this.r && u.t >= this.t && u.b <= this.b;
    }

    return u.x >= this.l && u.x <= this.r && u.y >= this.t && u.y <= this.b;
  }
}

// Constants
export const NULL_RECT = new Rect(0, 0, 0, 0);

// Namespace
const RectNS = {
  // Functions
  // - builders
  fromVector(u: IVector): IRect {
    return this.fromVectors(NULL_VECTOR, u);
  },

  fromVectors(u: IVector, v: IVector): IRect {
    return {
      t: Math.min(u.y, v.y),
      r: Math.max(u.x, v.x),
      b: Math.max(u.y, v.y),
      l: Math.min(u.x, v.x),
    };
  },

  fromVectorSize(u: IVector, s: Size): IRect {
    return {
      t: u.y,
      r: u.x + s.w,
      b: u.y + s.h,
      l: u.x,
    };
  },

  // - tests
  within(u: IVector | IRect, rect: IRect): boolean {
    if (isRect(u)) {
      return u.l >= rect.l && u.r <= rect.r && u.t >= rect.t && u.b <= rect.b;
    }

    return u.x >= rect.l && u.x <= rect.r && u.y >= rect.t && u.y <= rect.b;
  }
};

export default RectNS;
