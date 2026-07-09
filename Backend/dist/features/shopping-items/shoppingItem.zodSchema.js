"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateShoppingItemSchema = exports.createShoppingItemSchema = void 0;
const zod_1 = require("zod");
const shoppingItem_constants_1 = require("./shoppingItem.constants");
const shoppingItemCategorySchema = zod_1.z.enum(shoppingItem_constants_1.SHOPPING_ITEM_CATEGORIES);
const shoppingItemStatusSchema = zod_1.z.enum(shoppingItem_constants_1.SHOPPING_ITEM_STATUSES);
const shoppingItemUnitSchema = zod_1.z.enum(shoppingItem_constants_1.SHOPPING_ITEM_UNITS);
const shoppingItemPrioritySchema = zod_1.z.enum(shoppingItem_constants_1.SHOPPING_ITEM_PRIORITIES);
const shoppingItemStoreSchema = zod_1.z.enum(shoppingItem_constants_1.SHOPPING_ITEM_STORES);
exports.createShoppingItemSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .trim()
        .min(2, "Title must be at least 2 characters long")
        .max(60, "Title must be 60 characters or less"),
    description: zod_1.z
        .string()
        .trim()
        .min(5, "Description must be at least 5 characters long")
        .max(300, "Description must be 300 characters or less"),
    category: shoppingItemCategorySchema,
    status: shoppingItemStatusSchema,
    quantity: zod_1.z.coerce.number().positive("Quantity must be greater than 0"),
    unit: shoppingItemUnitSchema,
    priority: shoppingItemPrioritySchema,
    store: shoppingItemStoreSchema.optional(),
    price: zod_1.z.coerce.number().nonnegative("Price must not be negative").optional(),
});
exports.updateShoppingItemSchema = exports.createShoppingItemSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
});
//# sourceMappingURL=shoppingItem.zodSchema.js.map