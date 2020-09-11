// Types
export type Comparator<T> = (obj: T) => number;

// Utils
export function sfind<T>(list: T[], comparator: Comparator<T>): T | undefined {
  const i = sindexOf(list, comparator);

  return i > -1 ? list[i] : undefined;
}

export function sindexOf<T>(list: T[], comparator: Comparator<T>): number {
  let si = 0;
  let ei = list.length;

  while (si !== ei) {
    const mi = Math.floor((ei + si) / 2);
    const obj = list[mi];

    const cmp = comparator(obj);
    if (cmp === 0) {
      return mi;
    }

    if (cmp < 0) {
      si = mi + 1;
    } else {
      ei = mi;
    }
  }

  return -1;
}
