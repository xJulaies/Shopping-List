import { HydratedDocument } from "mongoose";
export type TShoppingItem = {
    userId: string;
    listId: string;
    title: string;
    description: string;
    category: string;
    status: string;
    quantity: number;
    unit: string;
    priority: string;
    store?: string;
    price?: number;
    createdAt: Date;
    updatedAt: Date;
};
export type TShoppingItemDocument = HydratedDocument<TShoppingItem>;
export declare const ShoppingItemModel: import("mongoose").Model<TShoppingItem, {}, {}, {}, import("mongoose").Document<unknown, {}, TShoppingItem, {}, import("mongoose").DefaultSchemaOptions> & TShoppingItem & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, TShoppingItem>;
//# sourceMappingURL=shoppingItem.model.d.ts.map