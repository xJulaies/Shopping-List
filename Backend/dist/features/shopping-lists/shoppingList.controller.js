"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE_shoppingList = exports.PATCH_updateShoppingList = exports.POST_createShoppingList = exports.GET_shoppingList = exports.GET_allShoppingLists = void 0;
const mongoose_1 = __importStar(require("mongoose"));
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
        const list = await shoppingList_model_1.ShoppingListModel.findOne({
            _id: listId,
            userId: authUserId,
        });
        if (!list) {
            return next((0, createError_1.createError)(404, "Shopping list not found"));
        }
        const database = mongoose_1.default.connection.db;
        const hello = database
            ? await database.admin().command({ hello: 1 })
            : undefined;
        const supportsTransactions = Boolean(hello?.setName || hello?.msg === "isdbgrid");
        if (supportsTransactions) {
            const session = await mongoose_1.default.startSession();
            try {
                await session.withTransaction(async () => {
                    await shoppingItem_model_1.ShoppingItemModel.deleteMany({
                        listId,
                        userId: authUserId,
                    }).session(session);
                    await shoppingList_model_1.ShoppingListModel.deleteOne({
                        _id: listId,
                        userId: authUserId,
                    }).session(session);
                });
            }
            finally {
                await session.endSession();
            }
        }
        else {
            await shoppingItem_model_1.ShoppingItemModel.deleteMany({ listId, userId: authUserId });
            await shoppingList_model_1.ShoppingListModel.deleteOne({
                _id: listId,
                userId: authUserId,
            });
        }
        return res.status(204).send();
    }
    catch (error) {
        return next((0, createError_1.createError)(500, "Cannot delete shopping list"));
    }
};
exports.DELETE_shoppingList = DELETE_shoppingList;
//# sourceMappingURL=shoppingList.controller.js.map