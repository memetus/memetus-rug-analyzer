import { getEnv } from "@/src/utils/env";
import { logger } from "@/src/config/log";
import { TwitterApi } from "twitter-api-v2";

export const createTwitterClient = () => {
  try {
    const bearerToken = getEnv("TWITTER_BEARER_TOKEN");

    if (!bearerToken) {
      console.log("Twitter bearer token not found");
      logger.error("Twitter bearer token not found");
      throw new Error("Twitter bearer token not found");
    }

    const client = new TwitterApi(bearerToken);

    return client;
  } catch (error) {
    console.log(error);
    logger.error("Failed to create twitter client", error);
    throw new Error("Failed to create twitter client");
  }
};
