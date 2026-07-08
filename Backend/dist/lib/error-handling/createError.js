"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createError = void 0;
const createError = (status, message) => {
    const error = new Error(message);
    error.status = status;
    return error;
};
exports.createError = createError;
//# sourceMappingURL=createError.js.map