import { ValidEnvType } from "@/src/types/env";

export const getEnv = (key: ValidEnvType, defaultValue?: string): string => {
  const value = process.env[key];
  if (!value && defaultValue === undefined) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value || defaultValue!;
};
