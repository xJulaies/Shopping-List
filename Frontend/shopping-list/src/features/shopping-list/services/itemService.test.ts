import { beforeEach, describe, expect, it } from "vitest";
import {
  createItem,
  deleteItem,
  getItemById,
  getItemsByList,
  updateItem,
} from "./itemService";
import type { CreateShoppingItemInput, ShoppingItem } from "../types/item";

const STORAGE_KEY = "shopping-list-items";

const baseItem: ShoppingItem = {
  id: "item-1",
  listId: "list-1",
  title: "Milch",
  description: "Bio Milch kaufen",
  category: "Milchprodukte",
  status: "offen",
  quantity: 2,
  unit: "Liter",
  priority: "hoch",
  store: "Rewe",
  price: 2.49,
  createdAt: "2026-01-01T10:00:00.000Z",
  updatedAt: "2026-01-01T10:00:00.000Z",
};

const createInput: CreateShoppingItemInput = {
  title: "Bananen",
  description: "Reife Bananen",
  category: "Obst & Gemüse",
  status: "offen",
  quantity: 1,
  unit: "kg",
  priority: "mittel",
  store: "Aldi",
  price: 1.29,
};

function seedItems(items: ShoppingItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

describe("itemService", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("loads mock items for their list when localStorage is empty", async () => {
    const items = await getItemsByList("mock-list");

    expect(items.length).toBeGreaterThan(0);
    expect(window.localStorage.getItem(STORAGE_KEY)).not.toBeNull();
  });

  it("loads a single item by id", async () => {
    seedItems([baseItem]);

    await expect(getItemById("list-1", "item-1")).resolves.toMatchObject({
      id: "item-1",
      title: "Milch",
    });
  });

  it("throws when an item id does not exist", async () => {
    seedItems([baseItem]);

    await expect(getItemById("list-1", "missing")).rejects.toThrow(
      "Eintrag nicht gefunden",
    );
  });

  it("creates an item and stores it", async () => {
    seedItems([baseItem]);

    const created = await createItem("list-1", createInput);
    const stored = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) ?? "[]",
    ) as ShoppingItem[];

    expect(created).toMatchObject({
      title: "Bananen",
      category: "Obst & Gemüse",
      listId: "list-1",
    });
    expect(created.id).toBeTruthy();
    expect(stored).toHaveLength(2);
    expect(stored[1].title).toBe("Bananen");
  });

  it("updates an item and keeps the id", async () => {
    seedItems([baseItem]);

    const updated = await updateItem("list-1", "item-1", {
      status: "gekauft",
      quantity: 3,
    });

    expect(updated).toMatchObject({
      id: "item-1",
      status: "gekauft",
      quantity: 3,
    });
  });

  it("deletes an item from storage", async () => {
    seedItems([baseItem]);

    await deleteItem("list-1", "item-1");
    const stored = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) ?? "[]",
    ) as ShoppingItem[];

    expect(stored).toHaveLength(0);
  });

  it("keeps items from different lists isolated", async () => {
    seedItems([
      baseItem,
      { ...baseItem, id: "item-2", listId: "list-2", title: "Brot" },
    ]);

    await expect(getItemsByList("list-1")).resolves.toEqual([baseItem]);
    await expect(getItemById("list-1", "item-2")).rejects.toThrow(
      "Eintrag nicht gefunden",
    );

    await deleteItem("list-1", "item-1");
    await expect(getItemsByList("list-2")).resolves.toHaveLength(1);
  });
});
