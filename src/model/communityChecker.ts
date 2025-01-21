import { BaseChecker } from "@/src/model/baseChecker";
import { DexScreenerGetter } from "@/src/module/dexScreenerGetter";
import { BaseCommunity } from "@/src/data/baseCommunity";
import { TwitterChecker } from "@/src/module/twitterChecker";
import { sampleDiscord, sampleTelegram, sampleTwitter } from "@/main";
import { TelegramChecker } from "@/src/module/telegramChecker";
import { DiscordChecker } from "@/src/module/discordChecker";

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
    await this.handleTelegram();
  }

  public async getCommunity() {
    const communties = await new DexScreenerGetter().getTokenCommunity(
      this.address
    );

    return communties;
  }

  public async getCommunityInfo() {
    const communities = await this.getCommunity();
    const communityCheckResult = [];

    const baseCommunity = new BaseCommunity();

    if (!communities || communities.length === 0)
      throw new Error("Failed to get community");

    for (const community of communities) {
      console.log(community);
    }
  }

  public async handleTwitter() {
    const twitterChecker = new TwitterChecker(sampleTwitter).check();
  }

  public async handleTelegram() {
    const telegramChecker = await new TelegramChecker(sampleTelegram).check();
  }

  public async handleDiscord() {
    const discordChecker = await new DiscordChecker(sampleDiscord).check();

    return discordChecker;
  }
}
