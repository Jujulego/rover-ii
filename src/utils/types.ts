// Types
export type ArgsArray<R extends any[], O extends any[] = []> = R | [...R, ...O];

// Functions
export type Comparator<T> = (a: T, b: T) => number;
