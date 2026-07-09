export const shoppingQueryKeys = {
  lists: (userId: string) => ["users", userId, "lists"] as const,
  list: (userId: string, listId: string) =>
    ["users", userId, "lists", listId] as const,
  items: (userId: string, listId: string) =>
    ["users", userId, "lists", listId, "items"] as const,
  item: (userId: string, listId: string, itemId: string) =>
    ["users", userId, "lists", listId, "items", itemId] as const,
};
