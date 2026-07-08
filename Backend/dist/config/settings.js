"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRuntimeSettings = exports.settings = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.settings = {
    PORT: process.env.PORT,
    BASE_URL: process.env.BASE_URL,
    MONGODB_URL: process.env.MONGODB_URL,
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
};
const validateRuntimeSettings = () => {
    const missingSettings = [
        ["PORT", exports.settings.PORT],
        ["BASE_URL", exports.settings.BASE_URL],
        ["MONGODB_URL", exports.settings.MONGODB_URL],
        ["CLERK_PUBLISHABLE_KEY", exports.settings.CLERK_PUBLISHABLE_KEY],
        ["CLERK_SECRET_KEY", exports.settings.CLERK_SECRET_KEY],
    ].filter(([, value]) => !value);
    if (missingSettings.length > 0) {
        const missingSettingNames = missingSettings
            .map(([settingName]) => settingName)
            .join(", ");
        throw new Error(`Missing required backend env values: ${missingSettingNames}`);
    }
};
exports.validateRuntimeSettings = validateRuntimeSettings;
//# sourceMappingURL=settings.js.map