import type {
  CreateShoppingItemInput,
  ShoppingItem,
  UpdateShoppingItemInput,
} from "../types/item";

const API_URL = "http://localhost:3001/items";

export async function getItems(): Promise<ShoppingItem[]> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Fehler beim Laden der Einträge");
  }
  return response.json();
}

export async function getItemById(id: string): Promise<ShoppingItem> {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error("Eintrag nicht gefunden");
  }
  return response.json();
}

export async function createItem(
  data: CreateShoppingItemInput,
): Promise<ShoppingItem> {
  const now = new Date().toISOString();
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, createdAt: now, updatedAt: now }),
  });
  if (!response.ok) {
    throw new Error("Fehler beim Erstellen des Eintrags");
  }
  return response.json();
}

export async function updateItem(
  id: string,
  data: UpdateShoppingItemInput,
): Promise<ShoppingItem> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, updatedAt: new Date().toISOString() }),
  });
  if (!response.ok) {
    throw new Error("Fehler beim Aktualisieren des Eintrags");
  }
  return response.json();
}

export async function deleteItem(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Fehler beim Löschen des Eintrags");
  }
}
