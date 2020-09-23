import { Size } from './size';

// Types
export type VectorOrderMode = 'xy' | 'yx';
export interface IVector {
  x: number;
  y: number;
}

type ArgsArray<R extends Array<any>, O extends Array<any> = []> = [...R] | [...R, ...O];
export type VectorArgs<R extends Array<any> = [], O extends Array<any> = []>
  = ArgsArray<[IVector, ...R], O> | ArgsArray<[number, number, ...R], O>;

// Utils
function parseArgs<R extends Array<any>, O extends Array<any>>(args: VectorArgs<R, O>): ArgsArray<[IVector, ...R], O> {
  if (typeof args[0] === 'object') {
    const [v, ...others] = args as ArgsArray<[IVector, ...R], O>;
    return [v, ...others];
  }

  if (args[1] !== undefined) {
    const [x, y, ...others] = args as ArgsArray<[number, number, ...R], O>;
    return [{ x, y }, ...others];
  }

  throw new Error('If arg1 is a number, arg2 must be defined !');
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
    const [{ x, y }] = parseArgs(args);
    this.x = x;
    this.y = y;
  }

  // Static methods
  static fromSize(s: Size): Vector {
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

  // - binary operations
  equals(v: IVector): boolean;
  equals(x: number, y: number): boolean;
  equals(...args: VectorArgs): boolean {
    const [v] = parseArgs(args);
    return this.x === v.x && this.y === v.y;
  }

  compare(v: IVector): number;
  compare(v: IVector, order: VectorOrderMode): number;
  compare(x: number, y: number): number;
  compare(x: number, y: number, order: VectorOrderMode): number;
  compare(...args: VectorArgs<[], [VectorOrderMode]>): number {
    const [v, order = 'xy'] = parseArgs(args);
    const d = this.sub(v);

    if (order === 'xy') {
      return d.x === 0 ? -d.y : -d.x;
    } else {
      return d.y === 0 ? -d.x : -d.y;
    }
  }

  add(v: IVector): Vector;
  add(x: number, y: number): Vector;
  add(...args: VectorArgs): Vector {
    const [v] = parseArgs(args);
    return new Vector(this.x + v.x, this.y + v.y);
  }

  sub(v: IVector): Vector;
  sub(x: number, y: number): Vector;
  sub(...args: VectorArgs): Vector {
    const [v] = parseArgs(args);
    return new Vector(this.x - v.x, this.y - v.y);
  }

  mul(k: number): Vector {
    return new Vector(this.x * k, this.y * k);
  }

  div(k: number): Vector {
    return new Vector(this.x / k, this.y / k);
  }

  // Properties
  get isNull(): boolean {
    return this.x === 0 && this.y === 0;
  }
}

// Constants
export const NULL_VECTOR = new Vector(0, 0);

// Utils
export function isVector(obj: any): obj is IVector {
  if (typeof obj === 'object') {
    return typeof obj.x === 'number' && typeof obj.y === 'number';
  }

  return false;
}

// Namespace
const VectorNS = {
  // Functions
  // - builders
  fromSize(s: Size): IVector {
    return { x: s.w, y: s.h };
  },

  // - unary operations
  norm(u: IVector): number {
    return Math.sqrt(u.x * u.x + u.y * u.y);
  },

  unit(u: IVector): IVector {
    if (this.equals(u, NULL_VECTOR)) {
      return NULL_VECTOR;
    }

    return this.div(u, this.norm(u));
  },

  // - binary operations
  equals(u: IVector, v: IVector): boolean {
    return u.x === v.x && u.y === v.y;
  },

  add(u: IVector, v: IVector): IVector {
    return {
      x: u.x + v.x,
      y: u.y + v.y
    };
  },

  sub(u: IVector, v: IVector): IVector {
    return {
      x: u.x - v.x,
      y: u.y - v.y
    };
  },

  mul(u: IVector, k: number): IVector {
    return {
      x: k * u.x,
      y: k * u.y
    };
  },

  div(u: IVector, k: number): IVector {
    return {
      x: Math.round(u.x / k),
      y: Math.round(u.y / k)
    };
  },

  compare(u: IVector, v: IVector, mode: VectorOrderMode = 'xy'): number {
    const d = this.sub(v, u);

    if (mode === 'xy') {
      return d.x === 0 ? d.y : d.x;
    } else {
      return d.y === 0 ? d.x : d.y;
    }
  }
};

export default VectorNS;
