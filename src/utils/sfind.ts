// Types
export type Comparator<T> = (obj: T) => number;

// Utils
function search<T>(list: T[], comparator: Comparator<T>): [number, T | null] {
  let si = 0;
  let ei = list.length;

  while (si !== ei) {
    const mi = Math.floor((ei + si) / 2);
    const obj = list[mi];

    const cmp = comparator(obj);
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

export function sindexOf<T>(list: T[], comparator: Comparator<T>): number {
  const [idx, obj] = search(list, comparator);
  return obj === null ? -1 : idx;
}

export function sfind<T>(list: T[], comparator: Comparator<T>): T | null {
  const [, obj] = search(list, comparator);
  return obj;
}
