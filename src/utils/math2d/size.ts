import { ArgsArray } from '../types';

// Types
export interface ISize {
  w: number;
  h: number;
}

export type SizeArgs<R extends Array<any> = [], O extends Array<any> = []>
  = ArgsArray<[ISize, ...R], O> | ArgsArray<[number, number, ...R], O>;

// Utils
export function parseSizeArgs<R extends Array<any>, O extends Array<any>>(args: SizeArgs<R, O>): ArgsArray<[ISize, ...R], O> {
  if (typeof args[0] === 'object') {
    return args as ArgsArray<[ISize, ...R], O>;
  }

  if (args[1] !== undefined) {
    const [w, h, ...others] = args as ArgsArray<[number, number, ...R], O>;
    return [{ w, h }, ...others];
  }

  throw new Error('If arg1 is a number, arg2 must be defined !');
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
