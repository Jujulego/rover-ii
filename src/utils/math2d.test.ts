import { Math2D } from 'src/utils/math2d';

// Test
// - unary operations
test('Math2D.norm', () => {
  expect(Math2D.norm({ x: 0, y: 0 }))
    .toBe(0);

  expect(Math2D.norm({ x: 1, y: 0 }))
    .toBe(1);

  expect(Math2D.norm({ x: 0, y: 1 }))
    .toBe(1);
});

describe('Math2D.unit', () => {
  it('should return a unit vector', () => {
    expect(Math2D.unit({ x: 2, y: 0 }))
      .toEqual({ x: 1, y: 0 });

    expect(Math2D.unit({ x: 0, y: 2 }))
      .toEqual({ x: 0, y: 1 });
  });

  it('should return the null vector', () => {
    expect(Math2D.unit({ x: 0, y: 0 }))
      .toEqual({ x: 0, y: 0 });
  });
});

// - binary operations
test('Math2D.add', () => {
  const u = { x: 1, y: 0 };
  const v = { x: 0, y: 1 };

  expect(Math2D.add(u, v))
    .toEqual({ x: 1, y: 1 })
});

test('Math2D.sub', () => {
  const u = { x: 1, y: 0 };
  const v = { x: 0, y: 1 };

  expect(Math2D.sub(u, v))
    .toEqual({ x: 1, y: -1 })
});

test('Math2D.mul', () => {
  const u = { x: 1, y: 1 };

  expect(Math2D.mul(u, 2))
    .toEqual({ x: 2, y: 2 })
});

test('Math2D.div', () => {
  const u = { x: 1, y: 1 };

  expect(Math2D.div(u, 2))
    .toEqual({ x: .5, y: .5 })
});
