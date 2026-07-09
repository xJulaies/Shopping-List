import { Request, RequestHandler } from "express";
import mongoose, { isValidObjectId } from "mongoose";
import { createError } from "../../lib/error-handling/createError";
import { TAuthenticatedRequest } from "../../middlewares/requireAuth";
import {
  ShoppingListModel,
  TShoppingListDocument,
} from "./shoppingList.model";
import { ShoppingItemModel } from "../shopping-items/shoppingItem.model";

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

const toFrontendList = (list: TShoppingListDocument) => {
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

export const GET_allShoppingLists: RequestHandler = async (req, res, next) => {
  try {
    const authUserId = getAuthUserId(req);
    const lists = await ShoppingListModel.find({ userId: authUserId }).sort({
      createdAt: -1,
    });

    return res.status(200).json(lists.map(toFrontendList));
  } catch (error) {
    return next(createError(500, "Cannot load shopping lists"));
  }
};

export const GET_shoppingList: RequestHandler = async (req, res, next) => {
  try {
    const authUserId = getAuthUserId(req);
    const listId = getListId(req);

    if (!isValidListId(listId)) {
      return next(createError(400, "Invalid shopping list id"));
    }

    const list = await ShoppingListModel.findOne({
      _id: listId,
      userId: authUserId,
    });

    if (!list) {
      return next(createError(404, "Shopping list not found"));
    }

    return res.status(200).json(toFrontendList(list));
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
    const createdList = await ShoppingListModel.create({
      userId: authUserId,
      ...req.body,
    });

    return res.status(201).json(toFrontendList(createdList));
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

    const updatedList = await ShoppingListModel.findOneAndUpdate(
      { _id: listId, userId: authUserId },
      req.body,
      { returnDocument: "after", runValidators: true },
    );

    if (!updatedList) {
      return next(createError(404, "Shopping list not found"));
    }

    return res.status(200).json(toFrontendList(updatedList));
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

    const list = await ShoppingListModel.findOne({
      _id: listId,
      userId: authUserId,
    });

    if (!list) {
      return next(createError(404, "Shopping list not found"));
    }

    const database = mongoose.connection.db;
    const hello = database
      ? await database.admin().command({ hello: 1 })
      : undefined;
    const supportsTransactions = Boolean(
      hello?.setName || hello?.msg === "isdbgrid",
    );

    if (supportsTransactions) {
      const session = await mongoose.startSession();

      try {
        await session.withTransaction(async () => {
          await ShoppingItemModel.deleteMany({
            listId,
            userId: authUserId,
          }).session(session);
          await ShoppingListModel.deleteOne({
            _id: listId,
            userId: authUserId,
          }).session(session);
        });
      } finally {
        await session.endSession();
      }
    } else {
      await ShoppingItemModel.deleteMany({ listId, userId: authUserId });
      await ShoppingListModel.deleteOne({
        _id: listId,
        userId: authUserId,
      });
    }

    return res.status(204).send();
  } catch (error) {
    return next(createError(500, "Cannot delete shopping list"));
  }
};
