"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateShoppingListItemSchema = exports.createShoppingListItemSchema = exports.updateShoppingListSchema = exports.createShoppingListSchema = void 0;
const zod_1 = require("zod");
exports.createShoppingListSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .trim()
        .min(1, "Title is required")
        .max(80, "Title must be 80 characters or less"),
});
exports.updateShoppingListSchema = zod_1.z
    .object({
    title: zod_1.z
        .string()
        .trim()
        .min(1, "Title is required")
        .max(80, "Title must be 80 characters or less")
        .optional(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
});
exports.createShoppingListItemSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .trim()
        .min(1, "Item name is required")
        .max(80, "Item name must be 80 characters or less"),
    quantity: zod_1.z
        .number()
        .int("Quantity must be a whole number")
        .min(1, "Quantity must be at least 1")
        .default(1),
});
exports.updateShoppingListItemSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .trim()
        .min(1, "Item name is required")
        .max(80, "Item name must be 80 characters or less")
        .optional(),
    quantity: zod_1.z
        .number()
        .int("Quantity must be a whole number")
        .min(1, "Quantity must be at least 1")
        .optional(),
    checked: zod_1.z.boolean().optional(),
});
//# sourceMappingURL=shoppingList.zodSchema.js.map