import { Vector } from 'src/utils/math2d';

// Basics
const TOP    = { x: 0,  y: -1 };
const LEFT   = { x: -1, y:  0 };
const BOTTOM = { x: 0,  y:  1 };
const RIGHT  = { x: 1,  y:  0 };

// Combined
const TOP_LEFT     = Vector.add(TOP,    LEFT);
const TOP_RIGHT    = Vector.add(TOP,    RIGHT);
const BOTTOM_RIGHT = Vector.add(BOTTOM, RIGHT);
const BOTTOM_LEFT  = Vector.add(BOTTOM, LEFT);

// Directions
export const DIRECTIONS = {
  // Basics
  TOP, LEFT, BOTTOM, RIGHT,

  // Combined
  TOP_LEFT, TOP_RIGHT, BOTTOM_RIGHT, BOTTOM_LEFT,

  // Lists
  BASICS: [
    TOP,
    LEFT,
    BOTTOM,
    RIGHT
  ],

  ALL: [
    RIGHT,
    BOTTOM_RIGHT,
    BOTTOM,
    BOTTOM_LEFT,
    LEFT,
    TOP_LEFT,
    TOP,
    TOP_RIGHT
  ]
}
