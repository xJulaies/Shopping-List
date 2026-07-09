import { z } from "zod";
export declare const createShoppingItemSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    category: z.ZodEnum<{
        "Obst & Gem\u00FCse": "Obst & Gemüse";
        Milchprodukte: "Milchprodukte";
        "Fleisch & Fisch": "Fleisch & Fisch";
        Getränke: "Getränke";
        Haushalt: "Haushalt";
        Sonstiges: "Sonstiges";
    }>;
    status: z.ZodEnum<{
        offen: "offen";
        "im Warenkorb": "im Warenkorb";
        gekauft: "gekauft";
    }>;
    quantity: z.ZodCoercedNumber<unknown>;
    unit: z.ZodEnum<{
        Stück: "Stück";
        kg: "kg";
        g: "g";
        Liter: "Liter";
        Packung: "Packung";
    }>;
    priority: z.ZodEnum<{
        niedrig: "niedrig";
        mittel: "mittel";
        hoch: "hoch";
    }>;
    store: z.ZodOptional<z.ZodEnum<{
        Kaufland: "Kaufland";
        Lidl: "Lidl";
        Rewe: "Rewe";
        Edeka: "Edeka";
        Penny: "Penny";
        Aldi: "Aldi";
        Netto: "Netto";
        Famila: "Famila";
    }>>;
    price: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export declare const updateShoppingItemSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodEnum<{
        "Obst & Gem\u00FCse": "Obst & Gemüse";
        Milchprodukte: "Milchprodukte";
        "Fleisch & Fisch": "Fleisch & Fisch";
        Getränke: "Getränke";
        Haushalt: "Haushalt";
        Sonstiges: "Sonstiges";
    }>>;
    status: z.ZodOptional<z.ZodEnum<{
        offen: "offen";
        "im Warenkorb": "im Warenkorb";
        gekauft: "gekauft";
    }>>;
    quantity: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    unit: z.ZodOptional<z.ZodEnum<{
        Stück: "Stück";
        kg: "kg";
        g: "g";
        Liter: "Liter";
        Packung: "Packung";
    }>>;
    priority: z.ZodOptional<z.ZodEnum<{
        niedrig: "niedrig";
        mittel: "mittel";
        hoch: "hoch";
    }>>;
    store: z.ZodOptional<z.ZodOptional<z.ZodEnum<{
        Kaufland: "Kaufland";
        Lidl: "Lidl";
        Rewe: "Rewe";
        Edeka: "Edeka";
        Penny: "Penny";
        Aldi: "Aldi";
        Netto: "Netto";
        Famila: "Famila";
    }>>>;
    price: z.ZodOptional<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
}, z.core.$strip>;
//# sourceMappingURL=shoppingItem.zodSchema.d.ts.map