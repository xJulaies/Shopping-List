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

const getItemId = (req: Request): string | undefined => {
  const { itemId } = req.params;

  return typeof itemId === "string" ? itemId : undefined;
};

const isValidListId = (listId: string | undefined): listId is string => {
  return typeof listId === "string" && isValidObjectId(listId);
};

const isValidItemId = (itemId: string | undefined): itemId is string => {
  return typeof itemId === "string" && isValidObjectId(itemId);
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

export const GET_shoppingList: RequestHandler = async (req, res, next) => {
  try {
    const authUserId = getAuthUserId(req);
    const listId = getListId(req);

    if (!isValidListId(listId)) {
      return next(createError(404, "Shopping list not found"));
    }

    const shoppingList = await ShoppingListModel.findOne({
      _id: listId,
      userId: authUserId,
    });

    if (!shoppingList) {
      return next(createError(404, "Shopping list not found"));
    }

    return res
      .status(200)
      .json(createAnswer(200, "Shopping list found", [shoppingList]));
  } catch (error) {
    return next(createError(500, "Cannot load shopping list"));
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

export const POST_createShoppingListItem: RequestHandler = async (
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
      {
        $push: {
          items: {
            name: req.body.name,
            quantity: req.body.quantity,
            checked: false,
          },
        },
      },
      { new: true, runValidators: true },
    );

    if (!updatedShoppingList) {
      return next(createError(404, "Shopping list not found"));
    }

    return res
      .status(201)
      .json(createAnswer(201, "Shopping list item created", [updatedShoppingList]));
  } catch (error) {
    return next(createError(500, "Cannot create shopping list item"));
  }
};

export const PATCH_updateShoppingListItem: RequestHandler = async (
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
      return next(createError(404, "Shopping list item not found"));
    }

    const itemUpdateData = Object.fromEntries(
      Object.entries(req.body).map(([field, value]) => [`items.$.${field}`, value]),
    );

    const updatedShoppingList = await ShoppingListModel.findOneAndUpdate(
      { _id: listId, userId: authUserId, "items._id": itemId },
      { $set: itemUpdateData },
      { new: true, runValidators: true },
    );

    if (!updatedShoppingList) {
      return next(createError(404, "Shopping list item not found"));
    }

    return res
      .status(200)
      .json(createAnswer(200, "Shopping list item updated", [updatedShoppingList]));
  } catch (error) {
    return next(createError(500, "Cannot update shopping list item"));
  }
};

export const DELETE_shoppingListItem: RequestHandler = async (
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
      return next(createError(404, "Shopping list item not found"));
    }

    const updatedShoppingList = await ShoppingListModel.findOneAndUpdate(
      { _id: listId, userId: authUserId, "items._id": itemId },
      { $pull: { items: { _id: itemId } } },
      { new: true, runValidators: true },
    );

    if (!updatedShoppingList) {
      return next(createError(404, "Shopping list item not found"));
    }

    return res
      .status(200)
      .json(createAnswer(200, "Shopping list item deleted", [updatedShoppingList]));
  } catch (error) {
    return next(createError(500, "Cannot delete shopping list item"));
  }
};
