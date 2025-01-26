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
      this.isTwitterVerified = accountInfo.verified ? true : false;
      this.twitterFollowers = accountInfo.public_metrics?.followers_count || 0;
      this.tweetCount = accountInfo.public_metrics?.tweet_count || 0;
      this.mediaCount = accountInfo.public_metrics?.media_count || 0;
      this.createdAtPoint = accountInfo.created_at;

      if (accountInfo.most_recent_tweet_id) {
        const lastTweetInfo = await baseCommunity.twitter.checker.getTweet(
          accountInfo.most_recent_tweet_id
        );
        this.lastUpdated = lastTweetInfo.created_at ?? undefined;
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

  public async getScore() {
    this.score += this.isTwitterExist ? 10 : -50;
    this.score += !this.isTelegramExist && !this.isDiscordExist ? -50 : 10;
    if (this.score === -100) return this._getScore();

    this.score += this.isTwitterVerified ? 20 : -20;
    this.score +=
      this.twitterFollowers > 10000
        ? 20
        : this.twitterFollowers > 5000
        ? 15
        : this.twitterFollowers > 1000
        ? 10
        : this.twitterFollowers > 500
        ? 5
        : 0;
    this.score +=
      this.tweetCount > 1000
        ? 20
        : this.tweetCount > 500
        ? 15
        : this.tweetCount > 300
        ? 10
        : this.tweetCount > 100
        ? 5
        : 0;

    this.score +=
      this.mediaCount > 100
        ? 20
        : this.mediaCount > 50
        ? 15
        : this.mediaCount > 20
        ? 10
        : this.mediaCount > 10
        ? 5
        : 0;

    this.score +=
      this.descriptionPoint > 5 ? 5 : this.descriptionPoint > 3 ? 3 : 0;
    this.score += this.urlPoint.length > 0 ? 5 : 0;

    if (this.lastUpdated) {
      const dateDiff = timeDifference(
        new Date(this.lastUpdated),
        new Date(),
        "h"
      );

      if (parseInt(dateDiff) > 24) {
        this.score -= 5;
      } else if (parseInt(dateDiff) > 12) {
        this.score -= 3;
      } else if (parseInt(dateDiff) > 6) {
        this.score += 3;
      } else if (parseInt(dateDiff) <= 3) {
        this.score += 5;
      }
    }
    const score = await this._getScore();
    if (score > 100) return 100;
    else if (score < -100) return -100;
    return score;
  }
}
