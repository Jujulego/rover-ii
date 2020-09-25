import { ArgsArray } from '../types';

import { IRect, parseRectArgs, RectArgs } from './rect';
import { ISize, parseSizeArgs, SizeArgs } from './size';

// Types
export interface IVector {
  x: number;
  y: number;
}

export type VectorArgs<R extends any[] = [], O extends any[] = []>
  = ArgsArray<[IVector, ...R], O> | ArgsArray<[number, number, ...R], O>;

export type VectorOrderMode = 'xy' | 'yx';

// Utils
export function isVector(obj: any): obj is IVector {
  if (typeof obj === 'object') {
    return typeof obj.x === 'number' && typeof obj.y === 'number';
  }

  return false;
}

export function parseVectorArgs<R extends any[], O extends any[]>(args: VectorArgs<R, O>): ArgsArray<[IVector, ...R], O> {
  if (isVector(args[0])) {
    return args as ArgsArray<[IVector, ...R], O>;
  }

  if (typeof args[0] === 'number' && typeof args[1] === 'number') {
    const [x, y, ...others] = args as ArgsArray<[number, number, ...R], O>;
    return [{ x, y }, ...others];
  }

  throw new Error('Invalid arguments !');
}

// Class
export class Vector implements IVector {
  // Attributes
  public x: number;
  public y: number;

  // Constructor
  constructor(u: IVector);
  constructor(x: number, y: number);
  constructor(...args: VectorArgs) {
    const [{ x, y }] = parseVectorArgs(args);
    this.x = x;
    this.y = y;
  }

  // Static methods
  static fromSize(s: ISize): Vector;
  static fromSize(w: number, h: number): Vector;
  static fromSize(...args: SizeArgs): Vector {
    const [s] = parseSizeArgs(args);
    return new Vector(s.w, s.h);
  }

  // Methods
  // - unary operations
  norm(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  unit(): Vector {
    if (this.isNull) return NULL_VECTOR;
    return this.div(this.norm());
  }

  normal(): Vector {
    return new Vector(this.y, -this.x);
  }

  // - binary operations
  equals(v: IVector): boolean;
  equals(x: number, y: number): boolean;
  equals(...args: VectorArgs): boolean {
    const [v] = parseVectorArgs(args);
    return this.x === v.x && this.y === v.y;
  }

  compare(v: IVector): number;
  compare(v: IVector, order: VectorOrderMode): number;
  compare(x: number, y: number): number;
  compare(x: number, y: number, order: VectorOrderMode): number;
  compare(...args: VectorArgs<[], [VectorOrderMode]>): number {
    const [v, order = 'xy'] = parseVectorArgs(args);
    const d = this.sub(v);

    if (order === 'xy') {
      return d.x === 0 ? -d.y : -d.x;
    } else {
      return d.y === 0 ? -d.x : -d.y;
    }
  }

  within(r: IRect): boolean;
  within(t: number, l: number, b: number, r: number): boolean;
  within(...args: RectArgs): boolean {
    const [r] = parseRectArgs(args);
    return this.x >= r.l && this.x <= r.r && this.y >= r.t && this.y <= r.b;
  }

  add(v: IVector): Vector;
  add(x: number, y: number): Vector;
  add(...args: VectorArgs): Vector {
    const [v] = parseVectorArgs(args);
    return new Vector(this.x + v.x, this.y + v.y);
  }

  sub(v: IVector): Vector;
  sub(x: number, y: number): Vector;
  sub(...args: VectorArgs): Vector {
    const [v] = parseVectorArgs(args);
    return new Vector(this.x - v.x, this.y - v.y);
  }

  mul(k: number): Vector {
    return new Vector(this.x * k, this.y * k);
  }

  div(k: number): Vector {
    return new Vector(this.x / k, this.y / k);
  }

  dot(v: IVector): number;
  dot(x: number, y: number): number;
  dot(...args: VectorArgs): number {
    const [v] = parseVectorArgs(args);
    return this.x * v.x + this.y * v.y;
  }

  // Properties
  get isNull(): boolean {
    return this.x === 0 && this.y === 0;
  }
}

// Constants
export const NULL_VECTOR = new Vector(0, 0);
