"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_2 = require("@clerk/express");
const settings_1 = require("./config/settings");
const createError_1 = require("./lib/error-handling/createError");
const createAnswer_1 = require("./lib/error-handling/createAnswer");
const db_1 = require("./db");
const shoppingList_routes_1 = require("./features/shopping-lists/shoppingList.routes");
const BASE_URL = settings_1.settings.BASE_URL;
const PORT = settings_1.settings.PORT;
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: "http://localhost:5173" }));
app.use((0, express_1.json)());
app.use((0, express_2.clerkMiddleware)());
app.use(`${BASE_URL}/lists`, shoppingList_routes_1.shoppingListRouter);
app.use((_req, _res, next) => {
    return next((0, createError_1.createError)(404, "Not found"));
});
app.use((err, _req, res, _next) => {
    return res
        .status(err.status || 500)
        .json((0, createAnswer_1.createAnswer)(err.status || 500, err.message || "Server Error", []));
});
async function startServer() {
    try {
        await (0, db_1.connectMongoDB)();
        app.listen(PORT, () => {
            console.log(`Server Booted at Port ${PORT}`);
        });
    }
    catch (error) {
        console.log("Server boot failed", error);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=index.js.map