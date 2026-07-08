import { HydratedDocument, model, Schema } from "mongoose";

export type TShoppingListItem = {
  name: string;
  quantity: number;
  checked: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type TShoppingList = {
  userId: string;
  title: string;
  items: TShoppingListItem[];
  createdAt: Date;
  updatedAt: Date;
};

export type TShoppingListDocument = HydratedDocument<TShoppingList>;

const shoppingListItemSchema = new Schema<TShoppingListItem>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    checked: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true },
);

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
      maxlength: 80,
    },
    items: {
      type: [shoppingListItemSchema],
      default: [],
    },
  },
  { timestamps: true },
);

shoppingListSchema.index({ userId: 1, createdAt: -1 });

export const ShoppingListModel = model<TShoppingList>(
  "ShoppingList",
  shoppingListSchema,
);
