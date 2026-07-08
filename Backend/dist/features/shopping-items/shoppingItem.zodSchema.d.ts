import { z } from "zod";
export declare const createShoppingItemSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    category: z.ZodString;
    status: z.ZodString;
    quantity: z.ZodCoercedNumber<unknown>;
    unit: z.ZodString;
    priority: z.ZodString;
    store: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export declare const updateShoppingItemSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodString>;
    quantity: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    unit: z.ZodOptional<z.ZodString>;
    priority: z.ZodOptional<z.ZodString>;
    store: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    price: z.ZodOptional<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
}, z.core.$strip>;
//# sourceMappingURL=shoppingItem.zodSchema.d.ts.map