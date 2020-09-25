import { ArgsArray } from '../types';

// Types
export interface ISize {
  w: number;
  h: number;
}

export type SizeArgs<R extends any[] = [], O extends any[] = []>
  = ArgsArray<[ISize, ...R], O> | ArgsArray<[number, number, ...R], O>;

// Utils
export function isSize(obj: any): obj is ISize {
  if (typeof obj === 'object') {
    return typeof obj.w === 'number'
      && typeof obj.h === 'number';
  }

  return false;
}

export function parseSizeArgs<R extends any[], O extends any[]>(args: SizeArgs<R, O>): ArgsArray<[ISize, ...R], O> {
  if (isSize(args[0])) {
    return args as ArgsArray<[ISize, ...R], O>;
  }

  if (typeof args[0] === 'number' && typeof args[1] === 'number') {
    const [w, h, ...others] = args as ArgsArray<[number, number, ...R], O>;
    return [{ w, h }, ...others];
  }

  throw new Error('Invalid arguments !');
}

// Class
export class Size implements ISize {
  // Attributes
  public w: number;
  public h: number;

  // Methods
  constructor(s: ISize);
  constructor(w: number, h: number);
  constructor(...args: SizeArgs) {
    const [s] = parseSizeArgs(args);
    this.w = s.w;
    this.h = s.h;
  }
}

// Constants
export const NULL_SIZE = new Size(0, 0);
