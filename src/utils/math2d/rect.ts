import { Size } from './size';
import { NULL_VECTOR, Vector } from './vector';

// Types
export interface Rect {
  t: number;
  r: number;
  b: number;
  l: number;
}

// Constants
export const NULL_RECT = { t: 0, r: 0, b: 0, l: 0 };

// Namespace
const RectNS = {
  // Functions
  // - builders
  fromVector(u: Vector): Rect {
    return this.fromVectors(NULL_VECTOR, u);
  },

  fromVectors(u: Vector, v: Vector): Rect {
    return {
      t: Math.min(u.y, v.y),
      r: Math.max(u.x, v.x),
      b: Math.max(u.y, v.y),
      l: Math.min(u.x, v.x),
    };
  },

  fromVectorSize(u: Vector, s: Size): Rect {
    return {
      t: u.y,
      r: u.x + s.w,
      b: u.y + s.h,
      l: u.x,
    };
  },

  // - tests
  within(u: Vector, rect: Rect): boolean {
    return u.x >= rect.l && u.x <= rect.r && u.y >= rect.t && u.y <= rect.b;
  }
};

export default RectNS;
