import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createItem, deleteItem, updateItem } from "../services/itemService";
import type { ShoppingItem, UpdateShoppingItemInput } from "../types/item";

export function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateShoppingItemInput }) =>
      updateItem(id, data),
    onSuccess: (updatedItem, variables) => {
      queryClient.setQueryData(["items", variables.id], updatedItem);
      queryClient.setQueryData<ShoppingItem[]>(["items"], (items) =>
        items?.map((item) =>
          item.id === variables.id ? updatedItem : item,
        ),
      );
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["items", variables.id] });
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}
