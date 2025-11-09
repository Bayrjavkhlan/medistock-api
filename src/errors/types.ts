type ErrorExtension = {
  code: string;
  message: string;
};

export type CustomError = Record<string, ErrorExtension>;
