import { getAuth } from "@clerk/express";
import { NextFunction, Request, Response } from "express";
import { createError } from "../lib/error-handling/createError";

export type TAuthenticatedRequest = Request & {
  authUserId: string;
};

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return next(createError(401, "Unauthorized"));
  }

  (req as TAuthenticatedRequest).authUserId = userId;
  return next();
};
