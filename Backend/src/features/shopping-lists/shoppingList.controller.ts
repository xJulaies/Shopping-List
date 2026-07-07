import { Request, RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import { createAnswer } from "../../lib/error-handling/createAnswer";
import { createError } from "../../lib/error-handling/createError";
import { TAuthenticatedRequest } from "../../middlewares/requireAuth";
import { ShoppingListModel } from "./shoppingList.model";

const getAuthUserId = (req: Request): string => {
  return (req as TAuthenticatedRequest).authUserId;
};

const getListId = (req: Request): string | undefined => {
  const { listId } = req.params;

  return typeof listId === "string" ? listId : undefined;
};

const isValidListId = (listId: string | undefined): listId is string => {
  return typeof listId === "string" && isValidObjectId(listId);
};

export const GET_allShoppingLists: RequestHandler = async (req, res, next) => {
  try {
    const authUserId = getAuthUserId(req);
    const shoppingLists = await ShoppingListModel.find({
      userId: authUserId,
    }).sort({ createdAt: -1 });

    return res
      .status(200)
      .json(createAnswer(200, "Shopping lists found", shoppingLists));
  } catch (error) {
    return next(createError(500, "Cannot load shopping lists"));
  }
};

export const POST_createShoppingList: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const authUserId = getAuthUserId(req);
    const createdShoppingList = await ShoppingListModel.create({
      userId: authUserId,
      title: req.body.title,
      items: [],
    });

    return res
      .status(201)
      .json(createAnswer(201, "Shopping list created", [createdShoppingList]));
  } catch (error) {
    return next(createError(500, "Cannot create shopping list"));
  }
};

export const PATCH_updateShoppingList: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const authUserId = getAuthUserId(req);
    const listId = getListId(req);

    if (!isValidListId(listId)) {
      return next(createError(404, "Shopping list not found"));
    }

    const updatedShoppingList = await ShoppingListModel.findOneAndUpdate(
      { _id: listId, userId: authUserId },
      req.body,
      { new: true, runValidators: true },
    );

    if (!updatedShoppingList) {
      return next(createError(404, "Shopping list not found"));
    }

    return res
      .status(200)
      .json(createAnswer(200, "Shopping list updated", [updatedShoppingList]));
  } catch (error) {
    return next(createError(500, "Cannot update shopping list"));
  }
};

export const DELETE_shoppingList: RequestHandler = async (req, res, next) => {
  try {
    const authUserId = getAuthUserId(req);
    const listId = getListId(req);

    if (!isValidListId(listId)) {
      return next(createError(404, "Shopping list not found"));
    }

    const deletedShoppingList = await ShoppingListModel.findOneAndDelete({
      _id: listId,
      userId: authUserId,
    });

    if (!deletedShoppingList) {
      return next(createError(404, "Shopping list not found"));
    }

    return res
      .status(200)
      .json(createAnswer(200, "Shopping list deleted", [deletedShoppingList]));
  } catch (error) {
    return next(createError(500, "Cannot delete shopping list"));
  }
};
