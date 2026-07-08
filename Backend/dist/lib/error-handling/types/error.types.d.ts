export type TStatusCode = 200 | 201 | 400 | 401 | 403 | 404 | 500;
export type TCreateError = Error & {
    status: TStatusCode;
};
//# sourceMappingURL=error.types.d.ts.map