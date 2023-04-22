export type DeepRequired<T> = T extends object
  ? {
      [Property in keyof T]-?: DeepRequired<T[Property]>;
    }
  : T;
