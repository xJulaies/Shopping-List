import { z } from "zod";

export const itemCategorySchema = z.enum([
  "Obst & Gemüse",
  "Milchprodukte",
  "Fleisch & Fisch",
  "Getränke",
  "Haushalt",
  "Sonstiges",
]);

export const itemStatusSchema = z.enum(["offen", "im Warenkorb", "gekauft"]);

export const itemUnitSchema = z.enum(["Stück", "kg", "g", "Liter", "Packung"]);

export const itemPrioritySchema = z.enum(["niedrig", "mittel", "hoch"]);

export const itemSchema = z.object({
  title: z
    .string()
    .min(2, "Titel muss mindestens 2 Zeichen lang sein")
    .max(60, "Titel darf höchstens 60 Zeichen lang sein"),
  description: z
    .string()
    .min(5, "Beschreibung muss mindestens 5 Zeichen lang sein")
    .max(300, "Beschreibung darf höchstens 300 Zeichen lang sein"),
  category: itemCategorySchema,
  status: itemStatusSchema,
  quantity: z
    .number({ message: "Menge muss eine Zahl sein" })
    .positive("Menge muss größer als 0 sein"),
  unit: itemUnitSchema,
  priority: itemPrioritySchema,
  store: z.string().optional(),
  price: z.number().nonnegative("Preis darf nicht negativ sein").optional(),
});

export type ItemFormValues = z.infer<typeof itemSchema>;
