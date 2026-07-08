import { TStatusCode } from "./types/error.types";

export const createAnswer = (
  status: TStatusCode,
  message: string,
  data: any[],
) => {
  return { status, message, data };
};
