import { BaseChecker } from "@/src/model/baseChecker";
import { DexScreenerGetter } from "@/src/module/dexScreenerGetter";
import { BaseCommunity } from "@/src/data/baseCommunity";
import { TwitterChecker } from "@/src/module/twitterChecker";
import { CommunityCheckResult } from "../data/result/communityCheckResult";
import { DiscordChecker } from "@/src/module/discordChecker";
import { TelegramChecker } from "@/src/module/telegramChecker";

interface ICommunityChecker {}

/**
 * CommunityChecker
 * @implements {ICommunityChecker}
 * @description This class is responsible for checking the community of a project.
 * It should check if the project has a community, It include social media link e.g. telegram, discord curretly.
 */
export class CommunityChecker extends BaseChecker implements ICommunityChecker {
  address: string;

  constructor(address: string) {
    super();
    this.address = address;
  }

  public async check() {
    const checkResult = new CommunityCheckResult();
    const data = await this.getCommunityInfo();
    return checkResult.setData({ baseCommunity: data }).then(async () => {
      const score = await checkResult.getScore();
      return score;
    });
  }

  public async getCommunity() {
    const communties = await new DexScreenerGetter().getTokenCommunity(
      this.address
    );

    return communties;
  }

  public async getCommunityInfo() {
    const communities = await this.getCommunity();
    const baseCommunity = new BaseCommunity();
    if (communities.length === 0) return baseCommunity;

    for (const com of communities) {
      if (com.type === "twitter") {
        const twitter = this.handleTwitter(com.url);
        baseCommunity.twitter = twitter;
      } else if (com.type === "discord") {
        const discord = this.handleDiscord(com.url);
        baseCommunity.discord = discord;
      } else if (com.type === "telegram") {
        const telegram = this.handleTelegram(com.url);
        baseCommunity.telegram = telegram;
      }
    }
    return baseCommunity;
  }

  public handleTwitter(handle: string) {
    const twitterChecker = new TwitterChecker(handle);
    return twitterChecker;
  }

  public handleDiscord(handle: string) {
    const discordChecker = new DiscordChecker(handle);
    return discordChecker;
  }

  public handleTelegram(handle: string) {
    const telegramChecker = new TelegramChecker(handle);
    return telegramChecker;
  }
}
