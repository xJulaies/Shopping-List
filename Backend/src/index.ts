import express, { json, NextFunction, Request, Response } from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { settings, validateRuntimeSettings } from "./config/settings";
import { createError } from "./lib/error-handling/createError";
import { createAnswer } from "./lib/error-handling/createAnswer";
import { connectMongoDB } from "./db";
import { shoppingItemRouter } from "./features/shopping-items/shoppingItem.routes";
import { shoppingListRouter } from "./features/shopping-lists/shoppingList.routes";
import type { TCreateError } from "./lib/error-handling/createError";

const BASE_URL = settings.BASE_URL;
const PORT = settings.PORT;
const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(json());

app.get("/", (_req: Request, res: Response) => {
  return res.status(200).json({ status: "ok", message: "API works" });
});

app.use(
  `${BASE_URL}/lists`,
  clerkMiddleware({
    publishableKey: settings.CLERK_PUBLISHABLE_KEY as string,
    secretKey: settings.CLERK_SECRET_KEY as string,
  }),
  shoppingListRouter,
);
app.use(
  `${BASE_URL}/lists/:listId/items`,
  clerkMiddleware({
    publishableKey: settings.CLERK_PUBLISHABLE_KEY as string,
    secretKey: settings.CLERK_SECRET_KEY as string,
  }),
  shoppingItemRouter,
);

app.use((_req: Request, _res: Response, next: NextFunction) => {
  return next(createError(404, "Not found"));
});

app.use(
  (err: TCreateError, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Backend error:", err);

    return res
      .status(err.status || 500)
      .json(createAnswer(err.status || 500, err.message || "Server Error", []));
  },
);

async function startServer() {
  try {
    validateRuntimeSettings();
    await connectMongoDB();
    app.listen(PORT, () => {
      console.log(`Server Booted at Port ${PORT}`);
    });
  } catch (error) {
    console.log("Server boot failed", error);
    process.exit(1);
  }
}

startServer();
