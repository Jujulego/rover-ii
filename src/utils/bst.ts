// Types
export type Comparator<T> = (a: T, b: T) => number;

// Class
export class BST<T> {
  // Attributes
  private readonly _array: T[];
  private readonly comparator: Comparator<T>;

  // Constructor
  constructor(comparator: Comparator<T>, elements: T[] = []) {
    this.comparator = comparator;

    this._array = Array.from(elements)
      .sort(comparator);
  }

  // Methods
  private search(elem: T): [number, T | null] {
    let si = 0;
    let ei = this.length;

    while (si !== ei) {
      const mi = Math.floor((ei + si) / 2);
      const obj = this.item(mi);

      const cmp = this.comparator(obj, elem);
      if (cmp === 0) {
        return [mi, obj];
      }

      if (cmp < 0) {
        si = mi + 1;
      } else {
        ei = mi;
      }

      if (si === ei) {
        return [mi, null];
      }
    }

    return [0, null];
  }

  item(i: number): T {
    return this._array[i];
  }

  indexOf(elem: T): number {
    const [idx, obj] = this.search(elem);
    return obj === null ? -1 : idx;
  }

  insert(elem: T) {
    let [idx,] = this.search(elem);
    const cmp = this.comparator(this._array[idx], elem);

    if (cmp <= 0) {
      ++idx;
    }

    this._array.splice(idx, 0, elem);
  }

  remove(elem: T) {
    const [idx, obj] = this.search(elem);

    if (obj !== null) {
      this._array.splice(idx, 1);
    }
  }

  map<R>(fn: (elem: T) => R): R[] {
    return this._array.map(fn);
  }

  reduce<R>(fn: (acc: R, elem: T) => R, init: R): R {
    return this._array.reduce(fn, init);
  }

  // Properties
  get array(): T[] {
    return Array.from(this._array);
  }

  get length() {
    return this._array.length;
  }
}
