"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shoppingItemRouter = void 0;
const express_1 = require("express");
const requireAuth_1 = require("../../middlewares/requireAuth");
const validateBody_1 = require("../../middlewares/validateBody");
const shoppingItem_controller_1 = require("./shoppingItem.controller");
const shoppingItem_zodSchema_1 = require("./shoppingItem.zodSchema");
exports.shoppingItemRouter = (0, express_1.Router)({ mergeParams: true });
exports.shoppingItemRouter.get("/", requireAuth_1.requireAuth, shoppingItem_controller_1.GET_allShoppingItems);
exports.shoppingItemRouter.post("/", requireAuth_1.requireAuth, (0, validateBody_1.validateBody)(shoppingItem_zodSchema_1.createShoppingItemSchema), shoppingItem_controller_1.POST_createShoppingItem);
exports.shoppingItemRouter.get("/:itemId", requireAuth_1.requireAuth, shoppingItem_controller_1.GET_shoppingItem);
exports.shoppingItemRouter.patch("/:itemId", requireAuth_1.requireAuth, (0, validateBody_1.validateBody)(shoppingItem_zodSchema_1.updateShoppingItemSchema), shoppingItem_controller_1.PATCH_updateShoppingItem);
exports.shoppingItemRouter.delete("/:itemId", requireAuth_1.requireAuth, shoppingItem_controller_1.DELETE_shoppingItem);
//# sourceMappingURL=shoppingItem.routes.js.map