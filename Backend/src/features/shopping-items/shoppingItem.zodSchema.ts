import { z } from "zod";
import {
  SHOPPING_ITEM_CATEGORIES,
  SHOPPING_ITEM_PRIORITIES,
  SHOPPING_ITEM_STATUSES,
  SHOPPING_ITEM_STORES,
  SHOPPING_ITEM_UNITS,
} from "./shoppingItem.constants";

const shoppingItemCategorySchema = z.enum(SHOPPING_ITEM_CATEGORIES);
const shoppingItemStatusSchema = z.enum(SHOPPING_ITEM_STATUSES);
const shoppingItemUnitSchema = z.enum(SHOPPING_ITEM_UNITS);
const shoppingItemPrioritySchema = z.enum(SHOPPING_ITEM_PRIORITIES);
const shoppingItemStoreSchema = z.enum(SHOPPING_ITEM_STORES);

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
  category: shoppingItemCategorySchema,
  status: shoppingItemStatusSchema,
  quantity: z.coerce.number().positive("Quantity must be greater than 0"),
  unit: shoppingItemUnitSchema,
  priority: shoppingItemPrioritySchema,
  store: shoppingItemStoreSchema.optional(),
  price: z.coerce.number().nonnegative("Price must not be negative").optional(),
});

export const updateShoppingItemSchema = createShoppingItemSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });
