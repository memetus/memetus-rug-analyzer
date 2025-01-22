import { BaseCheckResult } from "@/src/data/result/baseCheckResult";

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
  isTwitterVerified: boolean;
  twitterFollowers: number;
  tweetCount: number;
  mediaCount: number;
  descriptionPoint: number;
  urlPoint: { url: string; point: number }[];
  createdAtPoint: number;

  constructor(score: number) {
    super(score);

    this.isTwitterExist = false;
    this.isTelegramExist = false;
    this.isDiscordExist = false;
    this.isTwitterVerified = false;
    this.twitterFollowers = 0;
    this.tweetCount = 0;
    this.mediaCount = 0;
    this.descriptionPoint = 0;
    this.urlPoint = [];
    this.createdAtPoint = 0;
  }
}
