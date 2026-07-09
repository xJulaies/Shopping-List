"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoppingItemModel = void 0;
const mongoose_1 = require("mongoose");
const shoppingItem_constants_1 = require("./shoppingItem.constants");
const shoppingItemSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    listId: {
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
        maxlength: 60,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 300,
    },
    category: {
        type: String,
        required: true,
        trim: true,
        enum: shoppingItem_constants_1.SHOPPING_ITEM_CATEGORIES,
    },
    status: {
        type: String,
        required: true,
        trim: true,
        enum: shoppingItem_constants_1.SHOPPING_ITEM_STATUSES,
    },
    quantity: {
        type: Number,
        required: true,
        min: 0.01,
    },
    unit: {
        type: String,
        required: true,
        trim: true,
        enum: shoppingItem_constants_1.SHOPPING_ITEM_UNITS,
    },
    priority: {
        type: String,
        required: true,
        trim: true,
        enum: shoppingItem_constants_1.SHOPPING_ITEM_PRIORITIES,
    },
    store: {
        type: String,
        trim: true,
        enum: shoppingItem_constants_1.SHOPPING_ITEM_STORES,
    },
    price: {
        type: Number,
        min: 0,
    },
}, { timestamps: true });
shoppingItemSchema.index({ userId: 1, listId: 1, createdAt: -1 });
exports.ShoppingItemModel = (0, mongoose_1.model)("ShoppingItem", shoppingItemSchema);
//# sourceMappingURL=shoppingItem.model.js.map