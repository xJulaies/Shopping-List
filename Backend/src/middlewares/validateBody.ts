import { RequestHandler } from "express";
import { z, ZodError } from "zod";
import { createError } from "../lib/error-handling/createError";

const formatZodError = (error: ZodError) => {
  const firstIssue = error.issues[0];

  if (!firstIssue) {
    return "Invalid request body";
  }

  const path = firstIssue.path.join(".");
  return path ? `${path}: ${firstIssue.message}` : firstIssue.message;
};

export const validateBody = (zodSchema: z.ZodType): RequestHandler => {
  return (req, _res, next) => {
    try {
      req.body = zodSchema.parse(req.body);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(createError(400, formatZodError(error)));
      }

      return next(error);
    }
  };
};
