import { BaseChecker } from "@/src/model/baseChecker";
import { DexScreenerGetter } from "@/src/module/dexScreenerGetter";
import { BaseCommunity } from "@/src/data/baseCommunity";
import { TwitterChecker } from "@/src/module/twitterChecker";
import { TwitterApi } from "twitter-api-v2";
import { createTwitterClient } from "@/src/config/twitter";

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

    const baseCommunity = new BaseCommunity();

    for (const com of communities) {
      switch (com.type) {
        case "twitter":
          const twitter = await this.handleTwitter(com.url);
          baseCommunity.twitter = twitter;
      }
    }
  }

  public async handleTwitter(handle: string) {
    const twitterChecker = new TwitterChecker(handle);

    return twitterChecker;
  }
}
