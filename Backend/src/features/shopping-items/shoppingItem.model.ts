import { HydratedDocument, model, Schema } from "mongoose";

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
    },
    status: {
      type: String,
      required: true,
      trim: true,
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
    },
    priority: {
      type: String,
      required: true,
      trim: true,
    },
    store: {
      type: String,
      trim: true,
      enum: [
        "Kaufland",
        "Lidl",
        "Rewe",
        "Edeka",
        "Penny",
        "Aldi",
        "Netto",
        "Famila",
      ],
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
