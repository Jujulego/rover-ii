import { sfind } from './sfind';

// Generate test data
let users: Array<{ id: number }>;

beforeAll(() => {
  users = [];

  for (let i = 0; i < 100; ++i) {
    if (i !== 85) users.push({ id: i });
  }
});

// Tests
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
      .toBeUndefined();

    expect(sfind(users, (usr) => usr.id - 85))
      .toBeUndefined();
  });
});
