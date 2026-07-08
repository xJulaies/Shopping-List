"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateShoppingListSchema = exports.createShoppingListSchema = void 0;
const zod_1 = require("zod");
exports.createShoppingListSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .trim()
        .min(2, "Title must be at least 2 characters long")
        .max(80, "Title must be 80 characters or less"),
    description: zod_1.z
        .string()
        .trim()
        .max(300, "Description must be 300 characters or less")
        .optional(),
});
exports.updateShoppingListSchema = exports.createShoppingListSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
});
//# sourceMappingURL=shoppingList.zodSchema.js.map