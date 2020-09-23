import { Vector } from './vector';

// Test
// - unary operations
test('Vector.norm', () => {
  expect(new Vector(0, 0).norm())
    .toBe(0);

  expect(new Vector(1, 0).norm())
    .toBe(1);

  expect(new Vector(0, 1).norm())
    .toBe(1);
});

describe('Vector.unit', () => {
  it('should return a unit vector', () => {
    expect(new Vector(2, 0).unit())
      .toEqual({ x: 1, y: 0 });

    expect(new Vector(0, 2).unit())
      .toEqual({ x: 0, y: 1 });
  });

  it('should return the null vector', () => {
    expect(new Vector(0, 0).unit())
      .toEqual({ x: 0, y: 0 });
  });
});

// - binary operations
test('Vector.add', () => {
  const u = new Vector(1, 0);

  expect(u.add(0, 1))
    .toEqual({ x: 1, y: 1 })
});

test('Vector.sub', () => {
  const u = new Vector(1, 0);

  expect(u.sub(0, 1))
    .toEqual({ x: 1, y: -1 })
});

test('Vector.mul', () => {
  const u = new Vector(1, 1);

  expect(u.mul(2))
    .toEqual({ x: 2, y: 2 })
});

test('Vector.div', () => {
  const u = new Vector(1, 1);

  expect(u.div(2))
    .toEqual({ x: .5, y: .5 })
});
