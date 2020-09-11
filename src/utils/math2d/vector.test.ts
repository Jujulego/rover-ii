import VectorNS from './vector';

// Test
// - unary operations
test('Vector.norm', () => {
  expect(VectorNS.norm({ x: 0, y: 0 }))
    .toBe(0);

  expect(VectorNS.norm({ x: 1, y: 0 }))
    .toBe(1);

  expect(VectorNS.norm({ x: 0, y: 1 }))
    .toBe(1);
});

describe('Vector.unit', () => {
  it('should return a unit vector', () => {
    expect(VectorNS.unit({ x: 2, y: 0 }))
      .toEqual({ x: 1, y: 0 });

    expect(VectorNS.unit({ x: 0, y: 2 }))
      .toEqual({ x: 0, y: 1 });
  });

  it('should return the null vector', () => {
    expect(VectorNS.unit({ x: 0, y: 0 }))
      .toEqual({ x: 0, y: 0 });
  });
});

// - binary operations
test('Vector.add', () => {
  const u = { x: 1, y: 0 };
  const v = { x: 0, y: 1 };

  expect(VectorNS.add(u, v))
    .toEqual({ x: 1, y: 1 })
});

test('Vector.sub', () => {
  const u = { x: 1, y: 0 };
  const v = { x: 0, y: 1 };

  expect(VectorNS.sub(u, v))
    .toEqual({ x: 1, y: -1 })
});

test('Vector.mul', () => {
  const u = { x: 1, y: 1 };

  expect(VectorNS.mul(u, 2))
    .toEqual({ x: 2, y: 2 })
});

test('Vector.div', () => {
  const u = { x: 1, y: 1 };

  expect(VectorNS.div(u, 2))
    .toEqual({ x: .5, y: .5 })
});
