"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE_shoppingList = exports.PATCH_updateShoppingList = exports.POST_createShoppingList = exports.GET_allShoppingLists = void 0;
const mongoose_1 = require("mongoose");
const createAnswer_1 = require("../../lib/error-handling/createAnswer");
const createError_1 = require("../../lib/error-handling/createError");
const shoppingList_model_1 = require("./shoppingList.model");
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
const GET_allShoppingLists = async (req, res, next) => {
    try {
        const authUserId = getAuthUserId(req);
        const shoppingLists = await shoppingList_model_1.ShoppingListModel.find({
            userId: authUserId,
        }).sort({ createdAt: -1 });
        return res
            .status(200)
            .json((0, createAnswer_1.createAnswer)(200, "Shopping lists found", shoppingLists));
    }
    catch (error) {
        return next((0, createError_1.createError)(500, "Cannot load shopping lists"));
    }
};
exports.GET_allShoppingLists = GET_allShoppingLists;
const POST_createShoppingList = async (req, res, next) => {
    try {
        const authUserId = getAuthUserId(req);
        const createdShoppingList = await shoppingList_model_1.ShoppingListModel.create({
            userId: authUserId,
            title: req.body.title,
            items: [],
        });
        return res
            .status(201)
            .json((0, createAnswer_1.createAnswer)(201, "Shopping list created", [createdShoppingList]));
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
        const updatedShoppingList = await shoppingList_model_1.ShoppingListModel.findOneAndUpdate({ _id: listId, userId: authUserId }, req.body, { new: true, runValidators: true });
        if (!updatedShoppingList) {
            return next((0, createError_1.createError)(404, "Shopping list not found"));
        }
        return res
            .status(200)
            .json((0, createAnswer_1.createAnswer)(200, "Shopping list updated", [updatedShoppingList]));
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
        const deletedShoppingList = await shoppingList_model_1.ShoppingListModel.findOneAndDelete({
            _id: listId,
            userId: authUserId,
        });
        if (!deletedShoppingList) {
            return next((0, createError_1.createError)(404, "Shopping list not found"));
        }
        return res
            .status(200)
            .json((0, createAnswer_1.createAnswer)(200, "Shopping list deleted", [deletedShoppingList]));
    }
    catch (error) {
        return next((0, createError_1.createError)(500, "Cannot delete shopping list"));
    }
};
exports.DELETE_shoppingList = DELETE_shoppingList;
//# sourceMappingURL=shoppingList.controller.js.map