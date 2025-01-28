import { BaseCheckResult } from "@/src/data/result/baseCheckResult";
import { BaseCommunity } from "@/src/data/baseCommunity";
import { timeDifference } from "@/src/utils/time";
import { parseTwitterHandle } from "@/src/lib/parseTwitterHandle";

interface ICommunityCheckResult {}

/**
 * CommunityCheckResult
 * @implements {ICommunityCheckResult}
 * @description This class is responsible for checking the community of a project.
 * It should check if the project has a community.
 */

export class CommunityCheckResult
  extends BaseCheckResult
  implements ICommunityCheckResult
{
  isTwitterExist: boolean;
  isTelegramExist: boolean;
  isDiscordExist: boolean;
  isTwitterVerified: boolean | undefined;
  twitterFollowers: number;
  tweetCount: number;
  mediaCount: number;
  lastUpdated: string | undefined;
  descriptionPoint: number;
  urlPoint: { url: string }[];
  createdAtPoint: string | undefined;

  constructor() {
    const score = 0;
    super(score);

    this.isTwitterExist = false;
    this.isTelegramExist = false;
    this.isDiscordExist = false;
    this.isTwitterVerified = undefined;
    this.twitterFollowers = 0;
    this.tweetCount = 0;
    this.mediaCount = 0;
    this.lastUpdated = undefined;
    this.descriptionPoint = 0;
    this.urlPoint = [];
    this.createdAtPoint = undefined;
  }

  public async setData({ baseCommunity }: { baseCommunity: BaseCommunity }) {
    this.isTwitterExist = baseCommunity.twitter ? true : false;
    this.isTelegramExist = baseCommunity.telegram ? true : false;
    this.isDiscordExist = baseCommunity.discord ? true : false;
    if (
      baseCommunity.twitter &&
      baseCommunity.twitter.handle &&
      baseCommunity.twitter.checker
    ) {
      const accountInfo = await baseCommunity.twitter.checker.searchUsername(
        baseCommunity.twitter.handle
      );
      if (accountInfo) {
        this.isTwitterVerified = accountInfo.verified ? true : false;
        this.twitterFollowers =
          accountInfo.public_metrics?.followers_count || 0;
        this.tweetCount = accountInfo.public_metrics?.tweet_count || 0;
        this.mediaCount = accountInfo.public_metrics?.media_count || 0;
        this.createdAtPoint = accountInfo.created_at;

        if (accountInfo.most_recent_tweet_id) {
          const lastTweetInfo = await baseCommunity.twitter.checker.getTweet(
            accountInfo.most_recent_tweet_id
          );
          if (lastTweetInfo) {
            this.lastUpdated = lastTweetInfo.created_at ?? undefined;
          }
        }
        if (accountInfo.entities?.description) {
          let point = accountInfo.entities.description.cashtags?.length || 0;
          point += accountInfo.entities.description.hashtags?.length || 0;
          point += accountInfo.entities.description.mentions?.length || 0;
          this.descriptionPoint = point;
        }

        if (accountInfo.url) {
          this.urlPoint.push({ url: accountInfo.url });
        }
      }
    }
  }

  public async getScore() {
    if (this.isTwitterExist) {
      this.score += 10;
    } else {
      this.score -= 50;
    }

    if (this.isTelegramExist || this.isDiscordExist) {
      this.score += 10;
    } else {
      this.score -= 50;
    }

    if (this.score === -100) return -100;

    if (this.isTwitterVerified) {
      this.score += 20;
    } else {
      this.score -= 20;
    }

    if (this.twitterFollowers < 1000) {
      this.score -= 10;
    } else {
      const score = this.twitterFollowers / 100;
      this.score += score;
    }

    if (this.tweetCount > 1000) {
      this.score += 20;
    } else if (this.tweetCount > 500) {
      this.score += 15;
    } else if (this.tweetCount > 300) {
      this.score += 10;
    } else if (this.tweetCount > 100) {
      this.score += 5;
    }

    if (this.mediaCount > 100) {
      this.score += 10;
    } else if (this.mediaCount > 50) {
      this.score += 5;
    }

    if (this.lastUpdated) {
      const dateDiff = timeDifference(
        new Date(this.lastUpdated),
        new Date(),
        "h"
      );

      if (parseInt(dateDiff) > 24) {
        this.score -= 10;
      } else if (parseInt(dateDiff) > 12) {
        this.score -= 5;
      } else if (parseInt(dateDiff) > 6) {
        this.score += 5;
      } else if (parseInt(dateDiff) <= 3) {
        this.score += 10;
      }
    }

    if (this.score >= 100) return 100;
    else if (this.score <= -100) return -100;
    return this.score;
  }
}
