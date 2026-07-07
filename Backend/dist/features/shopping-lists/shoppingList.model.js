"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoppingListModel = void 0;
const mongoose_1 = require("mongoose");
const shoppingListItemSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 80,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
    },
    checked: {
        type: Boolean,
        required: true,
        default: false,
    },
}, { timestamps: true });
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
        maxlength: 80,
    },
    items: {
        type: [shoppingListItemSchema],
        default: [],
    },
}, { timestamps: true });
shoppingListSchema.index({ userId: 1, createdAt: -1 });
exports.ShoppingListModel = (0, mongoose_1.model)("ShoppingList", shoppingListSchema);
//# sourceMappingURL=shoppingList.model.js.map