import { z } from "zod";
export declare const createShoppingListSchema: z.ZodObject<{
    title: z.ZodString;
}, z.core.$strip>;
export declare const updateShoppingListSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const createShoppingListItemSchema: z.ZodObject<{
    name: z.ZodString;
    quantity: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare const updateShoppingListItemSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    quantity: z.ZodOptional<z.ZodNumber>;
    checked: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
//# sourceMappingURL=shoppingList.zodSchema.d.ts.map