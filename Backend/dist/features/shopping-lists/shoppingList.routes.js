"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shoppingListRouter = void 0;
const express_1 = require("express");
const requireAuth_1 = require("../../middlewares/requireAuth");
const validateBody_1 = require("../../middlewares/validateBody");
const shoppingList_controller_1 = require("./shoppingList.controller");
const shoppingList_zodSchema_1 = require("./shoppingList.zodSchema");
exports.shoppingListRouter = (0, express_1.Router)();
exports.shoppingListRouter.get("/", requireAuth_1.requireAuth, shoppingList_controller_1.GET_allShoppingLists);
exports.shoppingListRouter.post("/", requireAuth_1.requireAuth, (0, validateBody_1.validateBody)(shoppingList_zodSchema_1.createShoppingListSchema), shoppingList_controller_1.POST_createShoppingList);
exports.shoppingListRouter.get("/:listId", requireAuth_1.requireAuth, shoppingList_controller_1.GET_shoppingList);
exports.shoppingListRouter.patch("/:listId", requireAuth_1.requireAuth, (0, validateBody_1.validateBody)(shoppingList_zodSchema_1.updateShoppingListSchema), shoppingList_controller_1.PATCH_updateShoppingList);
exports.shoppingListRouter.delete("/:listId", requireAuth_1.requireAuth, shoppingList_controller_1.DELETE_shoppingList);
//# sourceMappingURL=shoppingList.routes.js.map