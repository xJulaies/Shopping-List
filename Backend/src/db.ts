import mongoose from "mongoose";
import { settings } from "./config/settings";
import { createError } from "./lib/error-handling/createError";

const RECONNECT_DELAY_IN_MS = 5000;
let reconnectTimeout: NodeJS.Timeout | undefined;
let hasRegisteredConnectionListeners = false;

const scheduleReconnect = () => {
  if (reconnectTimeout || mongoose.connection.readyState === 1) {
    return;
  }

  reconnectTimeout = setTimeout(async () => {
    reconnectTimeout = undefined;

    try {
      console.log("Trying to reconnect to MongoDB");
      await connectMongoDB();
    } catch (error) {
      console.log("MongoDB reconnect failed");
      scheduleReconnect();
    }
  }, RECONNECT_DELAY_IN_MS);
};

const registerConnectionListeners = () => {
  if (hasRegisteredConnectionListeners) {
    return;
  }

  mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected");
    scheduleReconnect();
  });

  mongoose.connection.on("error", (error) => {
    console.log("MongoDB connection error", error);
    scheduleReconnect();
  });

  hasRegisteredConnectionListeners = true;
};

export async function connectMongoDB() {
  try {
    if (!settings.MONGODB_URL) {
      throw createError(500, "MONGODB_URL is missing");
    }

    if (mongoose.connection.readyState === 1) {
      return;
    }

    registerConnectionListeners();

    await mongoose.connect(settings.MONGODB_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Connection to MongoDB failed");
    throw error;
  }
}
