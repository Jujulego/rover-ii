import { parseVectorArgs, Vector } from './vector';

// Test
// - utils
describe('parseVectorArgs', () => {
  test('with an object no options', () => {
    expect(parseVectorArgs([{ x: 1, y: 1 }]))
      .toEqual([{ x: 1, y: 1 }]);
  });

  test('with an object and options', () => {
    expect(parseVectorArgs([{ x: 1, y: 1 }, 'test', 85]))
      .toEqual([{ x: 1, y: 1 }, 'test', 85]);
  });

  test('with numbers no options', () => {
    expect(parseVectorArgs<[], []>([1, 1]))
      .toEqual([{ x: 1, y: 1 }]);
  });

  test('with numbers and options', () => {
    expect(parseVectorArgs<[string, number], []>([1, 1, 'test', 85]))
      .toEqual([{ x: 1, y: 1 }, 'test', 85]);
  });
});

// - tests
describe('Vector.within', () => {
  const u = new Vector(1, 1);

  it('should be within', () => {
    expect(u.within(0, 0, 2, 2))
      .toBeTruthy();
  });

  it('should be out (on r)', () => {
    expect(u.within(0, 0, 2, .5))
      .toBeFalsy();
  });

  it('should be out (on b)', () => {
    expect(u.within(0, 0, .5, 2))
      .toBeFalsy();
  });

  it('should be out (on l)', () => {
    expect(u.within(0, 1.5, 2, 2))
      .toBeFalsy();
  });

  it('should be out (on t)', () => {
    expect(u.within(1.5, 0, 2, 2))
      .toBeFalsy();
  });
});

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
describe('Vector.equals', () => {
  const u = new Vector(1, 1);

  it('should return true', () => {
    expect(u.equals(1, 1))
      .toBeTruthy();
  });

  it('should return false', () => {
    expect(u.equals(1, 2))
      .toBeFalsy();

    expect(u.equals(2, 1))
      .toBeFalsy();

    expect(u.equals(2, 2))
      .toBeFalsy();
  });
});

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
