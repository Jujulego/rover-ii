// Types
export type ArgsArray<Required extends any[], Options extends any[] = []>
  = Required | [...Required, ...Options];
