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

// Utils
export function isRect(obj: any): obj is Rect {
  if (typeof obj === 'object') {
    return typeof obj.t === 'number'
      && typeof obj.r === 'number'
      && typeof obj.b === 'number'
      && typeof obj.l === 'number';
  }

  return false;
}


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
  within(u: Vector | Rect, rect: Rect): boolean {
    if (isRect(u)) {
      return u.l >= rect.l && u.r <= rect.r && u.t >= rect.t && u.b <= rect.b;
    }

    return u.x >= rect.l && u.x <= rect.r && u.y >= rect.t && u.y <= rect.b;
  }
};

export default RectNS;
