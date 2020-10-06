import { IndexedArray } from './indexed-array';

// Prepare data
const numbers = [5, 1, 4, 8, 3, 4];
let array: IndexedArray<number>;

beforeEach(() => {
  array = IndexedArray.from((a, b) => b - a, numbers);
});

// Tests
describe('IndexedArray.item', () => {
  it('should return 5', () => {
    expect(array.item(0))
      .toBe(5);
  });

  it('should be undefined', () => {
    expect(array.item(-1))
      .toBeUndefined();
  });
});

describe('IndexedArray.contains', () => {
  it('should be true', () => {
    expect(array.contains(5))
      .toBeTruthy();
  });

  it('should be false', () => {
    expect(array.contains(10))
      .toBeFalsy();
  });
});

describe('IndexedArray.indexOf', () => {
  it('should return 0', () => {
    expect(array.indexOf(5))
      .toBe(0);
  });

  it('should return -1', () => {
    expect(array.indexOf(10))
      .toBe(-1);
  });
});

test('IndexedArray[Symbol.iterate]', () => {
  expect(Array.from(array))
    .toEqual(numbers);
});

test('IndexedArray.push', () => {
  array.push(12);

  expect(array.contains(12)).toBeTruthy();
  expect(array.item(array.length - 1)).toBe(12);
});

describe('IndexedArray.insert', () => {
  it('should insert at 0', () => {
    array.insert(0, 12);

    expect(array.contains(12)).toBeTruthy();
    expect(array.item(0)).toBe(12);
  });

  it('should insert at 1', () => {
    array.insert(1, 12);

    expect(array.contains(12)).toBeTruthy();
    expect(array.item(1)).toBe(12);
  });

  it('should insert at the end', () => {
    const idx = array.length;
    array.insert(idx, 12);

    expect(array.contains(12)).toBeTruthy();
    expect(array.item(idx)).toBe(12);
  });
});

test('IndexedArray.remove', () => {
  array.remove(0);
  expect(array.item(0)).toBe(1);
});
