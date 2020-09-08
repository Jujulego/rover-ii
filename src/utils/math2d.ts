// Types
export interface Vector {
  x: number;
  y: number;
}

// Constants
export const NULL_VECTOR = { x: 0, y: 0 };

// Namespace
export const Math2D = {
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
  }
}
