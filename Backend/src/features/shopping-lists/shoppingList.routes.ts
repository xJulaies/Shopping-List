import { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth";
import { validateBody } from "../../middlewares/validateBody";
import {
  DELETE_shoppingList,
  GET_allShoppingLists,
  PATCH_updateShoppingList,
  POST_createShoppingList,
} from "./shoppingList.controller";
import {
  createShoppingListSchema,
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
shoppingListRouter.patch(
  "/:listId",
  requireAuth,
  validateBody(updateShoppingListSchema),
  PATCH_updateShoppingList,
);
shoppingListRouter.delete("/:listId", requireAuth, DELETE_shoppingList);
