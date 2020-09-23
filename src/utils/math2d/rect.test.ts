import { parseRectArgs, Rect } from './rect';

// Tests
// - utils
describe('parseRectArgs', () => {
  test('with an object no options', () => {
    expect(parseRectArgs([{ t: 1, l: 1, b: 2, r: 2 }]))
      .toEqual([{ t: 1, l: 1, b: 2, r: 2 }]);
  });

  test('with an object and options', () => {
    expect(parseRectArgs([{ t: 1, l: 1, b: 2, r: 2 }, 'test', 85]))
      .toEqual([{ t: 1, l: 1, b: 2, r: 2 }, 'test', 85]);
  });

  test('with numbers no options', () => {
    expect(parseRectArgs<[], []>([1, 1, 2, 2]))
      .toEqual([{ t: 1, l: 1, b: 2, r: 2 }]);
  });

  test('with numbers and options', () => {
    expect(parseRectArgs<[string, number], []>([1, 1, 2, 2, 'test', 85]))
      .toEqual([{ t: 1, l: 1, b: 2, r: 2 }, 'test', 85]);
  });
});

// - builders
test('Rect.fromVectors', () => {
  expect(Rect.fromVectors(1, 1, 2, 2))
    .toEqual({ t: 1, l: 1, b: 2, r: 2 });
});

test('Rect.fromVectorSize', () => {
  expect(Rect.fromVectorSize(1, 1, { w: 1, h: 1 }))
    .toEqual({ t: 1, l: 1, b: 2, r: 2 });
});

// - tests
describe('Rect.within', () => {
  const r = new Rect(1, 1, 2, 2);

  it('should be within', () => {
    expect(r.within(0, 0, 3, 3))
      .toBeTruthy();
  });

  it('should be out (on r)', () => {
    expect(r.within(0, 0, 3, 1.5))
      .toBeFalsy();
  });

  it('should be out (on b)', () => {
    expect(r.within(0, 0, 1.5, 3))
      .toBeFalsy();
  });

  it('should be out (on l)', () => {
    expect(r.within(0, 1.5, 3, 3))
      .toBeFalsy();
  });

  it('should be out (on t)', () => {
    expect(r.within(1.5, 0, 3, 3))
      .toBeFalsy();
  });
});
