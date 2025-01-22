import { parseTwitterHandle } from "@/src/lib/parseTwitterHandle";
import { TwitterApi } from "twitter-api-v2";
import { createTwitterClient } from "@/src/config/twitter";
import { logger } from "@/src/config/log";

interface ITwitterChecker {}

/**
 * TwitterChecker
 * @implements {ITwitterChecker}
 * @description This class is responsible for checking the twitter of a project.
 * It should check if the project has a twitter account.
 */

export class TwitterChecker implements ITwitterChecker {
  account: string;
  client: TwitterApi;

  constructor(account: string) {
    this.account = parseTwitterHandle(account);
    this.client = createTwitterClient();
  }

  public async check() {}

  public async searchUsername(username?: string) {
    try {
      const account = username || this.account;
      const user = await this.client.v2.userByUsername(account, {
        "user.fields": [
          "created_at",
          "description",
          "entities",
          "id",
          "name",
          "pinned_tweet_id",
          "protected",
          "public_metrics",
          "url",
          "username",
          "verified",
          "verified_type",
          "most_recent_tweet_id",
        ],
      });

      return user.data;
    } catch (error) {
      console.log(error);
      logger.error("Failed to get user data", error);
      throw new Error("Failed to get user data");
    }
  }

  public async getUserMentions(userId: string, all: boolean = false) {
    if (!all) {
      try {
        const mentions = await this.client.v2.userMentionTimeline(userId, {
          max_results: 100,
        });

        return mentions.data;
      } catch (error) {
        console.log(error);
        logger.error("Failed to get mentions", error);
        throw new Error("Failed to get mentions");
      }
    }

    let nextToken: string | null | undefined = undefined;
    const mentionList = [];
    while (all && nextToken !== null) {
      try {
        const mentions = await this.client.v2.userMentionTimeline(userId, {
          max_results: 100,
          pagination_token: nextToken,
        });

        mentionList.push([...mentions.data.data]);
        nextToken = mentions.data.meta.next_token
          ? mentions.data.meta.next_token
          : null;
      } catch (error) {
        console.log(error);
        logger.error("Failed to get mentions", error);
        throw new Error("Failed to get mentions");
      }
    }

    return mentionList;
  }

  public async getUserTweets(username?: string) {
    const account = username || this.account;
    const tweets = await this.client.v2.userTimeline(account, {});

    return tweets;
  }

  public async searchKeyword(keyword: string) {
    const tweets = await this.client.v2.search(keyword, {
      "tweet.fields": "created_at",
    });

    return tweets;
  }
}
