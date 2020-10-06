import { BST } from './bst';
import { Comparator } from './types';

// Class
export class IndexedArray<T> {
  // Attributes
  private readonly _comparator: Comparator<T>;

  private _generator = 0;
  private readonly _order: number[] = [];
  private readonly _values = new Map<number, T>();
  private readonly _value_index: BST<number, T>;

  // Constructor
  constructor(comparator: Comparator<T>) {
    this._comparator = comparator;
    this._value_index = BST.empty<number, T>(id => this._values.get(id)!, comparator);
  }

  // Statics
  static from<T>(comparator: Comparator<T>, array: Iterable<T>): IndexedArray<T> {
    const res = new IndexedArray(comparator);
    res.push(...array);

    return res;
  }

  // Methods
  private generateId(): number {
    return ++this._generator;
  }

  private store(elements: T[]): number[] {
    const ids: number[] = [];

    for (const el of elements) {
      const id = this.generateId();
      ids.push(id);

      this._values.set(id, el);
      this._value_index.insert(id);
    }

    return ids;
  }

  // - item access
  item(idx: number): T | undefined {
    return this._values.get(this._order[idx]);
  }

  contains(element: T): boolean {
    return this._value_index.indexOf(element) !== -1;
  }

  indexOf(element: T): number {
    const id = this._value_index.find(element);
    return id === null ? -1 : this._order.indexOf(id);
  }

  // - iterate
  *[Symbol.iterator] () {
    for (const id of this._order) {
      yield this._values.get(id)!;
    }
  }

  // - modify
  push(...elements: T[]) {
    // Store values
    const ids = this.store(elements);

    // Push
    this._order.push(...ids);
  }

  insert(idx: number, ...elements: T[]) {
    // Store values
    const ids = this.store(elements);

    // Insert
    this._order.splice(idx, 0, ...ids);
  }

  remove(idx: number) {
    const [id] = this._order.splice(idx, 1);

    const element = this._values.get(id);
    if (element) {
      this._value_index.remove(element);
    }

    this._values.delete(id);
  }

  // Properties
  get length() {
    return this._order.length;
  }
}
