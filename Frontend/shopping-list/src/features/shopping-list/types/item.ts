export type ItemCategory =
  | "Obst & Gemüse"
  | "Milchprodukte"
  | "Fleisch & Fisch"
  | "Getränke"
  | "Haushalt"
  | "Sonstiges";

export type ItemStatus = "offen" | "im Warenkorb" | "gekauft";

export type ItemUnit = "Stück" | "kg" | "g" | "Liter" | "Packung";

export type ItemPriority = "niedrig" | "mittel" | "hoch";

export interface ShoppingItem {
  id: string;
  title: string;
  description: string;
  category: ItemCategory;
  status: ItemStatus;
  quantity: number;
  unit: ItemUnit;
  priority: ItemPriority;
  store?: string;
  price?: number;
  createdAt: string;
  updatedAt: string;
}

export type CreateShoppingItemInput = Omit<
  ShoppingItem,
  "id" | "createdAt" | "updatedAt"
>;

export type UpdateShoppingItemInput = Partial<CreateShoppingItemInput>;
