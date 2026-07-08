"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateShoppingItemSchema = exports.createShoppingItemSchema = void 0;
const zod_1 = require("zod");
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
    category: zod_1.z.string().trim().min(1, "Category is required"),
    status: zod_1.z.string().trim().min(1, "Status is required"),
    quantity: zod_1.z.coerce.number().positive("Quantity must be greater than 0"),
    unit: zod_1.z.string().trim().min(1, "Unit is required"),
    priority: zod_1.z.string().trim().min(1, "Priority is required"),
    store: zod_1.z.string().trim().optional(),
    price: zod_1.z.coerce.number().nonnegative("Price must not be negative").optional(),
});
exports.updateShoppingItemSchema = exports.createShoppingItemSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
});
//# sourceMappingURL=shoppingItem.zodSchema.js.map