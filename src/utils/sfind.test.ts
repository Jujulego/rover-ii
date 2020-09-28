import { sfind, sindexOf } from './sfind';

// Generate test data
let users: Array<{ id: number }>;

beforeAll(() => {
  users = [];

  for (let i = 0; i < 100; ++i) {
    if (i !== 85) users.push({ id: i });
  }
});

// Tests
describe('sindexOf', () => {
  test('on all existing elements', () => {
    for (let i = 0; i < users.length; i++) {
      const key = users[i].id;

      expect(sindexOf(users, (usr) => usr.id - key))
        .toBe(i);
    }
  });

  test('on unknown elements', () => {
    expect(sindexOf(users, (usr) => usr.id - (-1)))
      .toBe(-1);

    expect(sindexOf(users, (usr) => usr.id - 85))
      .toBe(-1);
  });
});

describe('sfind', () => {
  test('on all existing elements', () => {
    for (let i = 0; i < users.length; i++) {
      const key = users[i].id;

      expect(sfind(users, (usr) => usr.id - key))
        .toEqual(users[i]);
    }
  });

  test('on unknown elements', () => {
    expect(sfind(users, (usr) => usr.id - (-1)))
      .toBeNull();

    expect(sfind(users, (usr) => usr.id - 85))
      .toBeNull();
  });
});
