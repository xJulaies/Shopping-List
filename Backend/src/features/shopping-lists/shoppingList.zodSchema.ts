import { z } from "zod";

export const createShoppingListSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters long")
    .max(80, "Title must be 80 characters or less"),
  description: z
    .string()
    .trim()
    .max(300, "Description must be 300 characters or less")
    .optional(),
});

export const updateShoppingListSchema = createShoppingListSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });
