"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE_shoppingList = exports.PATCH_updateShoppingList = exports.POST_createShoppingList = exports.GET_shoppingList = exports.GET_allShoppingLists = void 0;
const mongoose_1 = require("mongoose");
const createError_1 = require("../../lib/error-handling/createError");
const shoppingList_model_1 = require("./shoppingList.model");
const shoppingItem_model_1 = require("../shopping-items/shoppingItem.model");
const getAuthUserId = (req) => {
    return req.authUserId;
};
const getListId = (req) => {
    const { listId } = req.params;
    return typeof listId === "string" ? listId : undefined;
};
const isValidListId = (listId) => {
    return typeof listId === "string" && (0, mongoose_1.isValidObjectId)(listId);
};
const toFrontendList = (list) => {
    const listObject = list.toObject({ versionKey: false });
    const id = String(listObject._id);
    return {
        id,
        title: listObject.title,
        description: listObject.description ?? "",
        createdAt: listObject.createdAt.toISOString(),
        updatedAt: listObject.updatedAt.toISOString(),
    };
};
const GET_allShoppingLists = async (req, res, next) => {
    try {
        const authUserId = getAuthUserId(req);
        const lists = await shoppingList_model_1.ShoppingListModel.find({ userId: authUserId }).sort({
            createdAt: -1,
        });
        return res.status(200).json(lists.map(toFrontendList));
    }
    catch (error) {
        return next((0, createError_1.createError)(500, "Cannot load shopping lists"));
    }
};
exports.GET_allShoppingLists = GET_allShoppingLists;
const GET_shoppingList = async (req, res, next) => {
    try {
        const authUserId = getAuthUserId(req);
        const listId = getListId(req);
        if (!isValidListId(listId)) {
            return next((0, createError_1.createError)(400, "Invalid shopping list id"));
        }
        const list = await shoppingList_model_1.ShoppingListModel.findOne({
            _id: listId,
            userId: authUserId,
        });
        if (!list) {
            return next((0, createError_1.createError)(404, "Shopping list not found"));
        }
        return res.status(200).json(toFrontendList(list));
    }
    catch (error) {
        return next((0, createError_1.createError)(500, "Cannot load shopping list"));
    }
};
exports.GET_shoppingList = GET_shoppingList;
const POST_createShoppingList = async (req, res, next) => {
    try {
        const authUserId = getAuthUserId(req);
        const createdList = await shoppingList_model_1.ShoppingListModel.create({
            userId: authUserId,
            ...req.body,
        });
        return res.status(201).json(toFrontendList(createdList));
    }
    catch (error) {
        return next((0, createError_1.createError)(500, "Cannot create shopping list"));
    }
};
exports.POST_createShoppingList = POST_createShoppingList;
const PATCH_updateShoppingList = async (req, res, next) => {
    try {
        const authUserId = getAuthUserId(req);
        const listId = getListId(req);
        if (!isValidListId(listId)) {
            return next((0, createError_1.createError)(404, "Shopping list not found"));
        }
        const updatedList = await shoppingList_model_1.ShoppingListModel.findOneAndUpdate({ _id: listId, userId: authUserId }, req.body, { returnDocument: "after", runValidators: true });
        if (!updatedList) {
            return next((0, createError_1.createError)(404, "Shopping list not found"));
        }
        return res.status(200).json(toFrontendList(updatedList));
    }
    catch (error) {
        return next((0, createError_1.createError)(500, "Cannot update shopping list"));
    }
};
exports.PATCH_updateShoppingList = PATCH_updateShoppingList;
const DELETE_shoppingList = async (req, res, next) => {
    try {
        const authUserId = getAuthUserId(req);
        const listId = getListId(req);
        if (!isValidListId(listId)) {
            return next((0, createError_1.createError)(404, "Shopping list not found"));
        }
        const deletedList = await shoppingList_model_1.ShoppingListModel.findOneAndDelete({
            _id: listId,
            userId: authUserId,
        });
        if (!deletedList) {
            return next((0, createError_1.createError)(404, "Shopping list not found"));
        }
        await shoppingItem_model_1.ShoppingItemModel.deleteMany({ listId, userId: authUserId });
        return res.status(204).send();
    }
    catch (error) {
        return next((0, createError_1.createError)(500, "Cannot delete shopping list"));
    }
};
exports.DELETE_shoppingList = DELETE_shoppingList;
//# sourceMappingURL=shoppingList.controller.js.map