import { useQuery } from "@tanstack/react-query";
import { getItems } from "../services/itemService";

export function useItems() {
  return useQuery({
    queryKey: ["items"],
    queryFn: getItems,
  });
}
