import { BST } from './bst';

// Prepare data
const numbers = [1, 2, 4, 5];
let bst: BST<number>;

beforeEach(() => {
  bst = new BST(obj => obj, (a, b) => a - b, numbers);
});

// Tests
describe('BST.indexOf', () => {
  test('on all existing elements', () => {
    for (let i = 0; i < numbers.length; i++) {
      expect(bst.indexOf(numbers[i]))
        .toBe(i);
    }
  });

  test('on unknown elements', () => {
    expect(bst.indexOf(3))
      .toBe(-1);

    expect(bst.indexOf(10))
      .toBe(-1);
  });
});

describe('BST.insert', () => {
  test('a new element in the middle', () => {
    bst.insert(3);

    expect(bst.array)
      .toEqual([1, 2, 3, 4, 5]);
  });

  test('a new element before first', () => {
    bst.insert(0);

    expect(bst.array)
      .toEqual([0, 1, 2, 4, 5]);
  });

  test('a new element after last', () => {
    bst.insert(6);

    expect(bst.array)
      .toEqual([1, 2, 4, 5, 6]);
  });
});

describe('BST.remove', () => {
  test('an existing element', () => {
    bst.remove(2);

    expect(bst.array)
      .toEqual([1, 4, 5]);
  });

  test('a missing element', () => {
    bst.remove(0);

    expect(bst.array)
      .toEqual([1, 2, 4, 5]);
  });
});
