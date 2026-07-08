import { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth";
import { validateBody } from "../../middlewares/validateBody";
import {
  DELETE_shoppingList,
  DELETE_shoppingListItem,
  GET_allShoppingLists,
  GET_shoppingList,
  PATCH_updateShoppingList,
  PATCH_updateShoppingListItem,
  POST_createShoppingList,
  POST_createShoppingListItem,
} from "./shoppingList.controller";
import {
  createShoppingListItemSchema,
  createShoppingListSchema,
  updateShoppingListItemSchema,
  updateShoppingListSchema,
} from "./shoppingList.zodSchema";

export const shoppingListRouter = Router();

shoppingListRouter.get("/", requireAuth, GET_allShoppingLists);
shoppingListRouter.post(
  "/",
  requireAuth,
  validateBody(createShoppingListSchema),
  POST_createShoppingList,
);
shoppingListRouter.get("/:listId", requireAuth, GET_shoppingList);
shoppingListRouter.patch(
  "/:listId",
  requireAuth,
  validateBody(updateShoppingListSchema),
  PATCH_updateShoppingList,
);
shoppingListRouter.delete("/:listId", requireAuth, DELETE_shoppingList);
shoppingListRouter.post(
  "/:listId/items",
  requireAuth,
  validateBody(createShoppingListItemSchema),
  POST_createShoppingListItem,
);
shoppingListRouter.patch(
  "/:listId/items/:itemId",
  requireAuth,
  validateBody(updateShoppingListItemSchema),
  PATCH_updateShoppingListItem,
);
shoppingListRouter.delete(
  "/:listId/items/:itemId",
  requireAuth,
  DELETE_shoppingListItem,
);
