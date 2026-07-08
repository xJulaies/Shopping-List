import { describe, expect, it } from "vitest";
import { itemSchema } from "./itemSchema";

const validItem = {
  title: "Milch",
  description: "Bio Milch kaufen",
  category: "Milchprodukte",
  status: "offen",
  quantity: 2,
  unit: "Liter",
  priority: "hoch",
  store: "Rewe",
  price: 2.49,
};

describe("itemSchema", () => {
  it("accepts a valid shopping item form value", () => {
    const result = itemSchema.safeParse(validItem);

    expect(result.success).toBe(true);
  });

  it("rejects short titles and descriptions", () => {
    const result = itemSchema.safeParse({
      ...validItem,
      title: "M",
      description: "Bio",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.message)).toContain(
      "Titel muss mindestens 2 Zeichen lang sein",
    );
    expect(result.error?.issues.map((issue) => issue.message)).toContain(
      "Beschreibung muss mindestens 5 Zeichen lang sein",
    );
  });

  it("rejects non-positive quantities and negative prices", () => {
    const result = itemSchema.safeParse({
      ...validItem,
      quantity: 0,
      price: -1,
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.message)).toContain(
      "Menge muss größer als 0 sein",
    );
    expect(result.error?.issues.map((issue) => issue.message)).toContain(
      "Preis darf nicht negativ sein",
    );
  });

  it("rejects invalid enum values", () => {
    const result = itemSchema.safeParse({
      ...validItem,
      status: "erledigt",
    });

    expect(result.success).toBe(false);
  });
});
