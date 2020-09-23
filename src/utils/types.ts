// Types
export type ArgsArray<R extends Array<any>, O extends Array<any> = []> = [...R] | [...R, ...O];
