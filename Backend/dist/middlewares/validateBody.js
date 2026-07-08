"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = void 0;
const zod_1 = require("zod");
const createError_1 = require("../lib/error-handling/createError");
const formatZodError = (error) => {
    const firstIssue = error.issues[0];
    if (!firstIssue) {
        return "Invalid request body";
    }
    const path = firstIssue.path.join(".");
    return path ? `${path}: ${firstIssue.message}` : firstIssue.message;
};
const validateBody = (zodSchema) => {
    return (req, _res, next) => {
        try {
            req.body = zodSchema.parse(req.body);
            return next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return next((0, createError_1.createError)(400, formatZodError(error)));
            }
            return next(error);
        }
    };
};
exports.validateBody = validateBody;
//# sourceMappingURL=validateBody.js.map