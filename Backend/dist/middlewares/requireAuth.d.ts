import { NextFunction, Request, Response } from "express";
export type TAuthenticatedRequest = Request & {
    authUserId: string;
};
export declare const requireAuth: (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=requireAuth.d.ts.map