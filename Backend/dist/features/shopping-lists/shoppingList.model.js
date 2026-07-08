"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoppingListModel = void 0;
const mongoose_1 = require("mongoose");
const shoppingListSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 80,
    },
    description: {
        type: String,
        trim: true,
        maxlength: 300,
        default: "",
    },
}, { timestamps: true });
shoppingListSchema.index({ userId: 1, createdAt: -1 });
exports.ShoppingListModel = (0, mongoose_1.model)("ShoppingList", shoppingListSchema);
//# sourceMappingURL=shoppingList.model.js.map