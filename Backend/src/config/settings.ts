import { config } from "dotenv";

config();

export const settings = {
  PORT: process.env.PORT,
  BASE_URL: process.env.BASE_URL,
  MONGODB_URL: process.env.MONGODB_URL,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
};

export const validateRuntimeSettings = () => {
  const missingSettings = [
    ["PORT", settings.PORT],
    ["BASE_URL", settings.BASE_URL],
    ["MONGODB_URL", settings.MONGODB_URL],
    ["CLERK_SECRET_KEY", settings.CLERK_SECRET_KEY],
  ].filter(([, value]) => !value);

  if (missingSettings.length > 0) {
    const missingSettingNames = missingSettings
      .map(([settingName]) => settingName)
      .join(", ");

    throw new Error(`Missing required backend env values: ${missingSettingNames}`);
  }
};
