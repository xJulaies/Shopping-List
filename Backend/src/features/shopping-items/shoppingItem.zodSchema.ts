import { z } from "zod";

const shoppingItemStoreSchema = z.enum([
  "Kaufland",
  "Lidl",
  "Rewe",
  "Edeka",
  "Penny",
  "Aldi",
  "Netto",
  "Famila",
]);

export const createShoppingItemSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters long")
    .max(60, "Title must be 60 characters or less"),
  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters long")
    .max(300, "Description must be 300 characters or less"),
  category: z.string().trim().min(1, "Category is required"),
  status: z.string().trim().min(1, "Status is required"),
  quantity: z.coerce.number().positive("Quantity must be greater than 0"),
  unit: z.string().trim().min(1, "Unit is required"),
  priority: z.string().trim().min(1, "Priority is required"),
  store: shoppingItemStoreSchema.optional(),
  price: z.coerce.number().nonnegative("Price must not be negative").optional(),
});

export const updateShoppingItemSchema = createShoppingItemSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });
