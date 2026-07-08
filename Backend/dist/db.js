"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMongoDB = connectMongoDB;
const mongoose_1 = __importDefault(require("mongoose"));
const settings_1 = require("./config/settings");
const createError_1 = require("./lib/error-handling/createError");
const RECONNECT_DELAY_IN_MS = 5000;
let reconnectTimeout;
let hasRegisteredConnectionListeners = false;
const scheduleReconnect = () => {
    if (reconnectTimeout || mongoose_1.default.connection.readyState === 1) {
        return;
    }
    reconnectTimeout = setTimeout(async () => {
        reconnectTimeout = undefined;
        try {
            console.log("Trying to reconnect to MongoDB");
            await connectMongoDB();
        }
        catch (error) {
            console.log("MongoDB reconnect failed");
            scheduleReconnect();
        }
    }, RECONNECT_DELAY_IN_MS);
};
const registerConnectionListeners = () => {
    if (hasRegisteredConnectionListeners) {
        return;
    }
    mongoose_1.default.connection.on("disconnected", () => {
        console.log("MongoDB disconnected");
        scheduleReconnect();
    });
    mongoose_1.default.connection.on("error", (error) => {
        console.log("MongoDB connection error", error);
        scheduleReconnect();
    });
    hasRegisteredConnectionListeners = true;
};
async function connectMongoDB() {
    try {
        if (!settings_1.settings.MONGODB_URL) {
            throw (0, createError_1.createError)(500, "MONGODB_URL is missing");
        }
        if (mongoose_1.default.connection.readyState === 1) {
            return;
        }
        registerConnectionListeners();
        await mongoose_1.default.connect(settings_1.settings.MONGODB_URL);
        console.log("Connected to MongoDB");
    }
    catch (error) {
        console.log("Connection to MongoDB failed");
        throw error;
    }
}
//# sourceMappingURL=db.js.map