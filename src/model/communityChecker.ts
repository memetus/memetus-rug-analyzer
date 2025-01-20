import { BaseChecker } from "@/src/model/baseChecker";
import { DexScreenerGetter } from "../module/dexScreenerGetter";
import { BaseCommunity } from "../data/baseCommunity";

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

  public async check() {}

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

  public async handleTwitter() {}

  public async handleTelegram() {}

  public async handleDiscord() {}
}
