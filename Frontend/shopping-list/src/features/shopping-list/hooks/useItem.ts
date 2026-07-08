import { useQuery } from "@tanstack/react-query";
import { getItemById } from "../services/itemService";

export function useItem(id: string) {
  return useQuery({
    queryKey: ["items", id],
    queryFn: () => getItemById(id),
    enabled: Boolean(id),
  });
}
