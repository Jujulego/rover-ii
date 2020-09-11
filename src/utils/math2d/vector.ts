// Types
export interface Vector {
  x: number;
  y: number;
}

export type VectorCompareMode = 'xy' | 'yx';

// Constants
export const NULL_VECTOR = { x: 0, y: 0 };

// Namespace
const VectorNS = {
  // Functions
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
      x: u.x / k,
      y: u.y / k
    };
  },

  compare(u: Vector, v: Vector, mode: VectorCompareMode = 'xy'): number {
    const d = this.sub(v, u);

    if (mode === 'xy') {
      return d.x === 0 ? d.y : d.x;
    } else {
      return d.y === 0 ? d.x : d.y;
    }
  }
};

export default VectorNS;
