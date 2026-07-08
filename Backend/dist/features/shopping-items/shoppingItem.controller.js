"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE_shoppingItem = exports.PATCH_updateShoppingItem = exports.POST_createShoppingItem = exports.GET_shoppingItem = exports.GET_allShoppingItems = void 0;
const mongoose_1 = require("mongoose");
const createError_1 = require("../../lib/error-handling/createError");
const shoppingItem_model_1 = require("./shoppingItem.model");
const shoppingList_model_1 = require("../shopping-lists/shoppingList.model");
const getAuthUserId = (req) => {
    return req.authUserId;
};
const getItemId = (req) => {
    const { itemId } = req.params;
    return typeof itemId === "string" ? itemId : undefined;
};
const getListId = (req) => {
    const { listId } = req.params;
    return typeof listId === "string" ? listId : undefined;
};
const isValidListId = (listId) => {
    return typeof listId === "string" && (0, mongoose_1.isValidObjectId)(listId);
};
const isValidItemId = (itemId) => {
    return typeof itemId === "string" && (0, mongoose_1.isValidObjectId)(itemId);
};
const userOwnsList = async (listId, userId) => {
    const list = await shoppingList_model_1.ShoppingListModel.exists({ _id: listId, userId });
    return Boolean(list);
};
const toFrontendItem = (item) => {
    const itemObject = item.toObject({ versionKey: false });
    return {
        id: String(itemObject._id),
        listId: itemObject.listId,
        title: itemObject.title,
        description: itemObject.description,
        category: itemObject.category,
        status: itemObject.status,
        quantity: itemObject.quantity,
        unit: itemObject.unit,
        priority: itemObject.priority,
        store: itemObject.store,
        price: itemObject.price,
        createdAt: itemObject.createdAt.toISOString(),
        updatedAt: itemObject.updatedAt.toISOString(),
    };
};
const GET_allShoppingItems = async (req, res, next) => {
    try {
        const authUserId = getAuthUserId(req);
        const listId = getListId(req);
        if (!isValidListId(listId) || !(await userOwnsList(listId, authUserId))) {
            return next((0, createError_1.createError)(404, "Shopping list not found"));
        }
        const items = await shoppingItem_model_1.ShoppingItemModel.find({
            userId: authUserId,
            listId,
        }).sort({
            createdAt: -1,
        });
        return res.status(200).json(items.map(toFrontendItem));
    }
    catch (error) {
        return next((0, createError_1.createError)(500, "Cannot load shopping items"));
    }
};
exports.GET_allShoppingItems = GET_allShoppingItems;
const GET_shoppingItem = async (req, res, next) => {
    try {
        const authUserId = getAuthUserId(req);
        const listId = getListId(req);
        const itemId = getItemId(req);
        if (!isValidListId(listId)) {
            return next((0, createError_1.createError)(404, "Shopping list not found"));
        }
        if (!isValidItemId(itemId)) {
            return next((0, createError_1.createError)(404, "Shopping item not found"));
        }
        const item = await shoppingItem_model_1.ShoppingItemModel.findOne({
            _id: itemId,
            userId: authUserId,
            listId,
        });
        if (!item) {
            return next((0, createError_1.createError)(404, "Shopping item not found"));
        }
        return res.status(200).json(toFrontendItem(item));
    }
    catch (error) {
        return next((0, createError_1.createError)(500, "Cannot load shopping item"));
    }
};
exports.GET_shoppingItem = GET_shoppingItem;
const POST_createShoppingItem = async (req, res, next) => {
    try {
        const authUserId = getAuthUserId(req);
        const listId = getListId(req);
        if (!isValidListId(listId) || !(await userOwnsList(listId, authUserId))) {
            return next((0, createError_1.createError)(404, "Shopping list not found"));
        }
        const createdItem = await shoppingItem_model_1.ShoppingItemModel.create({
            userId: authUserId,
            listId,
            ...req.body,
        });
        return res.status(201).json(toFrontendItem(createdItem));
    }
    catch (error) {
        return next((0, createError_1.createError)(500, "Cannot create shopping item"));
    }
};
exports.POST_createShoppingItem = POST_createShoppingItem;
const PATCH_updateShoppingItem = async (req, res, next) => {
    try {
        const authUserId = getAuthUserId(req);
        const listId = getListId(req);
        const itemId = getItemId(req);
        if (!isValidListId(listId)) {
            return next((0, createError_1.createError)(404, "Shopping list not found"));
        }
        if (!isValidItemId(itemId)) {
            return next((0, createError_1.createError)(404, "Shopping item not found"));
        }
        const updatedItem = await shoppingItem_model_1.ShoppingItemModel.findOneAndUpdate({ _id: itemId, userId: authUserId, listId }, req.body, { returnDocument: "after", runValidators: true });
        if (!updatedItem) {
            return next((0, createError_1.createError)(404, "Shopping item not found"));
        }
        return res.status(200).json(toFrontendItem(updatedItem));
    }
    catch (error) {
        return next((0, createError_1.createError)(500, "Cannot update shopping item"));
    }
};
exports.PATCH_updateShoppingItem = PATCH_updateShoppingItem;
const DELETE_shoppingItem = async (req, res, next) => {
    try {
        const authUserId = getAuthUserId(req);
        const listId = getListId(req);
        const itemId = getItemId(req);
        if (!isValidListId(listId)) {
            return next((0, createError_1.createError)(404, "Shopping list not found"));
        }
        if (!isValidItemId(itemId)) {
            return next((0, createError_1.createError)(404, "Shopping item not found"));
        }
        const deletedItem = await shoppingItem_model_1.ShoppingItemModel.findOneAndDelete({
            _id: itemId,
            userId: authUserId,
            listId,
        });
        if (!deletedItem) {
            return next((0, createError_1.createError)(404, "Shopping item not found"));
        }
        return res.status(204).send();
    }
    catch (error) {
        return next((0, createError_1.createError)(500, "Cannot delete shopping item"));
    }
};
exports.DELETE_shoppingItem = DELETE_shoppingItem;
//# sourceMappingURL=shoppingItem.controller.js.map