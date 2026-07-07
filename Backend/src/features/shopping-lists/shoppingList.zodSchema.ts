import { z } from "zod";

export const createShoppingListSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(80, "Title must be 80 characters or less"),
});

export const updateShoppingListSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(80, "Title must be 80 characters or less")
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const createShoppingListItemSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Item name is required")
    .max(80, "Item name must be 80 characters or less"),
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1")
    .default(1),
});

export const updateShoppingListItemSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Item name is required")
    .max(80, "Item name must be 80 characters or less")
    .optional(),
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1")
    .optional(),
  checked: z.boolean().optional(),
});
