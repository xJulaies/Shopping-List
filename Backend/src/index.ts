import express, { json, NextFunction, Request, Response } from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { settings } from "./config/settings";
import { createError } from "./lib/error-handling/createError";
import { createAnswer } from "./lib/error-handling/createAnswer";
import { connectMongoDB } from "./db";
import { shoppingListRouter } from "./features/shopping-lists/shoppingList.routes";
import type { TCreateError } from "./lib/error-handling/createError";

const BASE_URL = settings.BASE_URL;
const PORT = settings.PORT;
const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(json());
app.use(clerkMiddleware());

app.use(`${BASE_URL}/lists`, shoppingListRouter);

app.use((_req: Request, _res: Response, next: NextFunction) => {
  return next(createError(404, "Not found"));
});

app.use(
  (err: TCreateError, _req: Request, res: Response, _next: NextFunction) => {
    return res
      .status(err.status || 500)
      .json(createAnswer(err.status || 500, err.message || "Server Error", []));
  },
);

async function startServer() {
  try {
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
