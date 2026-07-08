import { Request, RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import { createError } from "../../lib/error-handling/createError";
import { TAuthenticatedRequest } from "../../middlewares/requireAuth";
import {
  ShoppingItemModel,
  TShoppingItemDocument,
} from "./shoppingItem.model";
import { ShoppingListModel } from "../shopping-lists/shoppingList.model";

const getAuthUserId = (req: Request): string => {
  return (req as TAuthenticatedRequest).authUserId;
};

const getItemId = (req: Request): string | undefined => {
  const { itemId } = req.params;

  return typeof itemId === "string" ? itemId : undefined;
};

const getListId = (req: Request): string | undefined => {
  const { listId } = req.params;

  return typeof listId === "string" ? listId : undefined;
};

const isValidListId = (listId: string | undefined): listId is string => {
  return typeof listId === "string" && isValidObjectId(listId);
};

const isValidItemId = (itemId: string | undefined): itemId is string => {
  return typeof itemId === "string" && isValidObjectId(itemId);
};

const userOwnsList = async (listId: string, userId: string) => {
  const list = await ShoppingListModel.exists({ _id: listId, userId });

  return Boolean(list);
};

const toFrontendItem = (item: TShoppingItemDocument) => {
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

export const GET_allShoppingItems: RequestHandler = async (req, res, next) => {
  try {
    const authUserId = getAuthUserId(req);
    const listId = getListId(req);

    if (!isValidListId(listId) || !(await userOwnsList(listId, authUserId))) {
      return next(createError(404, "Shopping list not found"));
    }

    const items = await ShoppingItemModel.find({
      userId: authUserId,
      listId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json(items.map(toFrontendItem));
  } catch (error) {
    return next(createError(500, "Cannot load shopping items"));
  }
};

export const GET_shoppingItem: RequestHandler = async (req, res, next) => {
  try {
    const authUserId = getAuthUserId(req);
    const listId = getListId(req);
    const itemId = getItemId(req);

    if (!isValidListId(listId)) {
      return next(createError(404, "Shopping list not found"));
    }

    if (!isValidItemId(itemId)) {
      return next(createError(404, "Shopping item not found"));
    }

    const item = await ShoppingItemModel.findOne({
      _id: itemId,
      userId: authUserId,
      listId,
    });

    if (!item) {
      return next(createError(404, "Shopping item not found"));
    }

    return res.status(200).json(toFrontendItem(item));
  } catch (error) {
    return next(createError(500, "Cannot load shopping item"));
  }
};

export const POST_createShoppingItem: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const authUserId = getAuthUserId(req);
    const listId = getListId(req);

    if (!isValidListId(listId) || !(await userOwnsList(listId, authUserId))) {
      return next(createError(404, "Shopping list not found"));
    }

    const createdItem = await ShoppingItemModel.create({
      userId: authUserId,
      listId,
      ...req.body,
    });

    return res.status(201).json(toFrontendItem(createdItem));
  } catch (error) {
    return next(createError(500, "Cannot create shopping item"));
  }
};

export const PATCH_updateShoppingItem: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const authUserId = getAuthUserId(req);
    const listId = getListId(req);
    const itemId = getItemId(req);

    if (!isValidListId(listId)) {
      return next(createError(404, "Shopping list not found"));
    }

    if (!isValidItemId(itemId)) {
      return next(createError(404, "Shopping item not found"));
    }

    const updatedItem = await ShoppingItemModel.findOneAndUpdate(
      { _id: itemId, userId: authUserId, listId },
      req.body,
      { returnDocument: "after", runValidators: true },
    );

    if (!updatedItem) {
      return next(createError(404, "Shopping item not found"));
    }

    return res.status(200).json(toFrontendItem(updatedItem));
  } catch (error) {
    return next(createError(500, "Cannot update shopping item"));
  }
};

export const DELETE_shoppingItem: RequestHandler = async (req, res, next) => {
  try {
    const authUserId = getAuthUserId(req);
    const listId = getListId(req);
    const itemId = getItemId(req);

    if (!isValidListId(listId)) {
      return next(createError(404, "Shopping list not found"));
    }

    if (!isValidItemId(itemId)) {
      return next(createError(404, "Shopping item not found"));
    }

    const deletedItem = await ShoppingItemModel.findOneAndDelete({
      _id: itemId,
      userId: authUserId,
      listId,
    });

    if (!deletedItem) {
      return next(createError(404, "Shopping item not found"));
    }

    return res.status(204).send();
  } catch (error) {
    return next(createError(500, "Cannot delete shopping item"));
  }
};
