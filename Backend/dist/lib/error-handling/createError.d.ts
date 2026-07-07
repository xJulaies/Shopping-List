import type { TStatusCode } from "./types/error.types";
export type TCreateError = Error & {
    status: TStatusCode;
};
export declare const createError: (status: TStatusCode, message: string) => TCreateError;
//# sourceMappingURL=createError.d.ts.map