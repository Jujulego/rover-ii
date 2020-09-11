import { Size } from './size';

// Types
export interface Vector {
  x: number;
  y: number;
}

export type VectorOrderMode = 'xy' | 'yx';

// Constants
export const NULL_VECTOR = { x: 0, y: 0 };

// Utils
export function isVector(obj: any): obj is Vector {
  if (typeof obj === 'object') {
    return typeof obj.x === 'number' && typeof obj.y === 'number';
  }

  return false;
}

// Namespace
const VectorNS = {
  // Functions
  // - builders
  fromSize(s: Size): Vector {
    return { x: s.w, y: s.h };
  },

  // - unary operations
  norm(u: Vector): number {
    return Math.sqrt(u.x * u.x + u.y * u.y);
  },

  unit(u: Vector): Vector {
    if (this.equals(u, NULL_VECTOR)) {
      return NULL_VECTOR;
    }

    return this.div(u, this.norm(u));
  },

  // - binary operations
  equals(u: Vector, v: Vector): boolean {
    return u.x === v.x && u.y === v.y;
  },

  add(u: Vector, v: Vector): Vector {
    return {
      x: u.x + v.x,
      y: u.y + v.y
    };
  },

  sub(u: Vector, v: Vector): Vector {
    return {
      x: u.x - v.x,
      y: u.y - v.y
    };
  },

  mul(u: Vector, k: number): Vector {
    return {
      x: k * u.x,
      y: k * u.y
    };
  },

  div(u: Vector, k: number): Vector {
    return {
      x: Math.round(u.x / k),
      y: Math.round(u.y / k)
    };
  },

  compare(u: Vector, v: Vector, mode: VectorOrderMode = 'xy'): number {
    const d = this.sub(v, u);

    if (mode === 'xy') {
      return d.x === 0 ? d.y : d.x;
    } else {
      return d.y === 0 ? d.x : d.y;
    }
  }
};

export default VectorNS;
