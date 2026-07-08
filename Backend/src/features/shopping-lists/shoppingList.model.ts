import { HydratedDocument, model, Schema } from "mongoose";

export type TShoppingList = {
  userId: string;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TShoppingListDocument = HydratedDocument<TShoppingList>;

const shoppingListSchema = new Schema<TShoppingList>(
  {
    userId: {
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
      maxlength: 80,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },
  },
  { timestamps: true },
);

shoppingListSchema.index({ userId: 1, createdAt: -1 });

export const ShoppingListModel = model<TShoppingList>(
  "ShoppingList",
  shoppingListSchema,
);
