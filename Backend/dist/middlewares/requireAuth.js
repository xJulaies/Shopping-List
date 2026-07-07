"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const express_1 = require("@clerk/express");
const createError_1 = require("../lib/error-handling/createError");
const requireAuth = (req, _res, next) => {
    const { userId } = (0, express_1.getAuth)(req);
    if (!userId) {
        return next((0, createError_1.createError)(401, "Unauthorized"));
    }
    req.authUserId = userId;
    return next();
};
exports.requireAuth = requireAuth;
//# sourceMappingURL=requireAuth.js.map