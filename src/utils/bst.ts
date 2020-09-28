// Types
export type ExtractKey<T, K> = (elem: T) => K;
export type Comparator<T> = (a: T, b: T) => number;

// Class
export class BST<T, K = T> {
  // Attributes
  private readonly _array: T[];
  private readonly _map: ExtractKey<T, K>;
  private readonly _comparator: Comparator<K>;

  // Constructor
  constructor(map: (elem: T) => K, comparator: Comparator<K>, elements: T[] = []) {
    this._map = map;
    this._comparator = comparator;

    this._array = Array.from(elements)
      .sort((a, b) => comparator(map(a), map(b)));
  }

  // Methods
  private search(elem: K): [number, T | null] {
    let si = 0;
    let ei = this.length;

    while (si !== ei) {
      const mi = Math.floor((ei + si) / 2);
      const obj = this.item(mi);

      const cmp = this._comparator(this._map(obj), elem);
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

  indexOf(key: K): number {
    const [idx, obj] = this.search(key);
    return obj === null ? -1 : idx;
  }

  find(key: K): T | null {
    const [,obj] = this.search(key);
    return obj;
  }

  insert(elem: T) {
    const key = this._map(elem);

    let [idx,] = this.search(key);
    if (this._comparator(this._map(this._array[idx]), key) <= 0) {
      ++idx;
    }

    this._array.splice(idx, 0, elem);
  }

  remove(elem: K) {
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
