export interface ShoppingList {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateShoppingListInput = {
  title: string;
  description?: string;
};

export type UpdateShoppingListInput = Partial<CreateShoppingListInput>;
