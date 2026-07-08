import { HydratedDocument } from "mongoose";
export type TShoppingList = {
    userId: string;
    title: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
};
export type TShoppingListDocument = HydratedDocument<TShoppingList>;
export declare const ShoppingListModel: import("mongoose").Model<TShoppingList, {}, {}, {}, import("mongoose").Document<unknown, {}, TShoppingList, {}, import("mongoose").DefaultSchemaOptions> & TShoppingList & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, TShoppingList>;
//# sourceMappingURL=shoppingList.model.d.ts.map