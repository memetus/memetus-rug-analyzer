import { getEnv } from "@/src/utils/env";
import { logger } from "./log";
import { TwitterApi } from "twitter-api-v2";

export const createTwitterClient = () => {
  const bearerToken = getEnv("TWITTER_BEARER_TOKEN");

  if (!bearerToken) {
    logger.error("Twitter bearer token not found");
    throw new Error("Twitter bearer token not found");
  }

  const client = new TwitterApi(bearerToken);

  return client;
};
