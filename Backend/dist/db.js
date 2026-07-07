"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMongoDB = connectMongoDB;
const mongoose_1 = __importDefault(require("mongoose"));
const settings_1 = require("./config/settings");
const createError_1 = require("./lib/error-handling/createError");
async function connectMongoDB() {
    try {
        if (!settings_1.settings.MONGODB_URL) {
            throw (0, createError_1.createError)(500, "MONGODB_URL is missing");
        }
        await mongoose_1.default.connect(settings_1.settings.MONGODB_URL);
        console.log("Connected to MongoDB");
    }
    catch (error) {
        console.log("Connection to MongoDB failed");
        throw error;
    }
}
//# sourceMappingURL=db.js.map