import { HydratedDocument, model, Schema } from "mongoose";
import {
  SHOPPING_ITEM_CATEGORIES,
  SHOPPING_ITEM_PRIORITIES,
  SHOPPING_ITEM_STATUSES,
  SHOPPING_ITEM_STORES,
  SHOPPING_ITEM_UNITS,
} from "./shoppingItem.constants";

export type TShoppingItem = {
  userId: string;
  listId: string;
  title: string;
  description: string;
  category: string;
  status: string;
  quantity: number;
  unit: string;
  priority: string;
  store?: string;
  price?: number;
  createdAt: Date;
  updatedAt: Date;
};

export type TShoppingItemDocument = HydratedDocument<TShoppingItem>;

const shoppingItemSchema = new Schema<TShoppingItem>(
  {
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
      enum: SHOPPING_ITEM_CATEGORIES,
    },
    status: {
      type: String,
      required: true,
      trim: true,
      enum: SHOPPING_ITEM_STATUSES,
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
      enum: SHOPPING_ITEM_UNITS,
    },
    priority: {
      type: String,
      required: true,
      trim: true,
      enum: SHOPPING_ITEM_PRIORITIES,
    },
    store: {
      type: String,
      trim: true,
      enum: SHOPPING_ITEM_STORES,
    },
    price: {
      type: Number,
      min: 0,
    },
  },
  { timestamps: true },
);

shoppingItemSchema.index({ userId: 1, listId: 1, createdAt: -1 });

export const ShoppingItemModel = model<TShoppingItem>(
  "ShoppingItem",
  shoppingItemSchema,
);
