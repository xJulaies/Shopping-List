import { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth";
import { validateBody } from "../../middlewares/validateBody";
import {
  DELETE_shoppingItem,
  GET_allShoppingItems,
  GET_shoppingItem,
  PATCH_updateShoppingItem,
  POST_createShoppingItem,
} from "./shoppingItem.controller";
import {
  createShoppingItemSchema,
  updateShoppingItemSchema,
} from "./shoppingItem.zodSchema";

export const shoppingItemRouter = Router({ mergeParams: true });

shoppingItemRouter.get("/", requireAuth, GET_allShoppingItems);
shoppingItemRouter.post(
  "/",
  requireAuth,
  validateBody(createShoppingItemSchema),
  POST_createShoppingItem,
);
shoppingItemRouter.get("/:itemId", requireAuth, GET_shoppingItem);
shoppingItemRouter.patch(
  "/:itemId",
  requireAuth,
  validateBody(updateShoppingItemSchema),
  PATCH_updateShoppingItem,
);
shoppingItemRouter.delete("/:itemId", requireAuth, DELETE_shoppingItem);
