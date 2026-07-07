"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settings = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.settings = {
    PORT: process.env.PORT,
    BASE_URL: process.env.BASE_URL,
    MONGODB_URL: process.env.MONGODB_URL,
};
//# sourceMappingURL=settings.js.map