import { GREEN } from "@/src/cli";
import { CheckData } from "@/src/types/provider";
import { timeDifference } from "@/src/utils/time";

interface IMemetusRugChecker {}

export type ProjectType =
  | "ai-agent"
  | "ai-meme"
  | "animal-theme"
  | "celebrity-theme"
  | "political-theme"
  | "sports-theme"
  | "desci"
  | "defai"
  | "artificial-intelligence"
  | "anime-theme"
  | "country-theme"
  | "gaming"
  | "memorial"
  | undefined;

/**
 * MemetusRugChecker
 * @implements {IMemetusRugChecker}
 * @description This class is responsible for aggregate all checker in single module.
 * It should contain communityChecker, holderChecker, liquidityChecker, marketChecker, metadataChecker, referenceChecker, websiteChecker.
 */

export class MemetusRugChecker implements IMemetusRugChecker {
  type: ProjectType;
  data: CheckData;
  holderScore: number = 0;
  liquidityScore: number = 0;
  marketScore: number = 0;
  metadataScore: number = 0;
  websiteScore: number = 0;
  githubScore: number = 0;
  communityScore: number = 0;

  constructor(data: CheckData, type: ProjectType) {
    this.data = data;
    this.type = type;
  }

  public getScore() {
    const holderScore = this.getHolderScore();
    const liquidityScore = this.getLiquidityScore();
    const marketScore = this.getMarketScore();
    const metadataScore = this.getMetadataScore();
    const websiteScore = this.getWebsiteScore();
    const githubScore = this.getGithubScore();
    const communityScore = this.getCommunityScore();

    console.log(`${GREEN}Holder score complated!`);
    console.log(`${GREEN}Liquidity score complated!`);
    console.log(`${GREEN}Market score complated!`);
    console.log(`${GREEN}Metadata score complated!`);
    console.log(`${GREEN}Website score complated!`);
    console.log(`${GREEN}Community score complated!`);

    if (
      this.type === "ai-agent" ||
      this.type === "defai" ||
      this.type === "artificial-intelligence"
    ) {
      console.log(`${GREEN}Github score complated!`);

      return (
        holderScore * 0.1 +
        liquidityScore * 0.1 +
        marketScore * 0.1 +
        metadataScore * 0.1 +
        websiteScore * 0.1 +
        githubScore * 0.2 +
        communityScore * 0.15
      );
    }

    return (
      holderScore * 0.1 +
      liquidityScore * 0.1 +
      marketScore * 0.1 +
      metadataScore * 0.1 +
      websiteScore * 0.1 +
      communityScore * 0.1
    );
  }

  public getHolderScore() {
    if (this.data.totalHolder >= 10000) {
      this.holderScore += 20;
    } else if (this.data.totalHolder >= 5000) {
      this.holderScore += 15;
    } else if (this.data.totalHolder >= 1000) {
      this.holderScore += 10;
    } else if (this.data.totalHolder >= 500) {
      this.holderScore += 5;
    } else if (this.data.totalHolder >= 100) {
      this.holderScore -= 5;
    } else if (this.data.totalHolder < 100) {
      this.holderScore -= 10;
    }

    let top10Percentage = 0;
    for (const holder of this.data.topHolders) {
      top10Percentage += holder.percentage;
    }
    if (top10Percentage > 30) {
      this.holderScore -= 20;
    } else if (top10Percentage > 25) {
      this.holderScore -= 15;
    } else if (top10Percentage > 20) {
      this.holderScore -= 10;
    } else if (top10Percentage < 15) {
      this.holderScore += 10;
    } else if (top10Percentage < 10) {
      this.holderScore += 15;
    } else if (top10Percentage < 5) {
      this.holderScore += 20;
    }

    for (const holder of this.data.top10Validation) {
      if (!holder.validation) {
        this.holderScore -= 5;
      }
    }

    if (this.data.creatorLock.isLocked) {
      const balance =
        this.data.creatorBalance + parseFloat(this.data.creatorLock.lockAmount);
      const percentage = (this.data.totalSupply / balance) * 100;

      if (percentage > 30) {
        this.holderScore -= 20;
      } else if (percentage > 25) {
        this.holderScore -= 15;
      } else if (percentage > 20) {
        this.holderScore -= 10;
      } else if (percentage > 15) {
        this.holderScore += 10;
      } else if (percentage > 10) {
        this.holderScore += 15;
      } else if (percentage > 5) {
        this.holderScore += 20;
      }
    } else {
      if (this.data.creatorPercentage > 30) {
        this.holderScore -= 20;
      } else if (this.data.creatorPercentage > 25) {
        this.holderScore -= 15;
      } else if (this.data.creatorPercentage > 20) {
        this.holderScore -= 10;
      } else if (this.data.creatorPercentage > 15) {
        this.holderScore += 10;
      } else if (this.data.creatorPercentage > 10) {
        this.holderScore += 15;
      } else if (this.data.creatorPercentage > 5) {
        this.holderScore += 20;
      }
    }

    if (this.holderScore >= 100) return 100;
    else if (this.holderScore <= -100) return -100;
    return this.holderScore;
  }

  public getLiquidityScore() {
    if (this.data.marketCap / 20 < this.data.totalLiquidity) {
      this.liquidityScore += 20;
    } else if (this.data.marketCap / 15 < this.data.totalLiquidity) {
      this.liquidityScore += 15;
    } else if (this.data.marketCap / 10 < this.data.totalLiquidity) {
      this.liquidityScore += 10;
    } else if (this.data.marketCap / 5 < this.data.totalLiquidity) {
      this.liquidityScore -= 10;
    } else if (this.data.marketCap / 5 > this.data.totalLiquidity) {
      this.liquidityScore -= 15;
    }

    if (this.data.totalLpCount >= 5) {
      this.liquidityScore += 15;
    } else if (this.data.totalLpCount >= 4) {
      this.liquidityScore += 10;
    } else if (this.data.totalLpCount >= 3) {
      this.liquidityScore += 5;
    } else if (this.data.totalLpCount >= 2) {
      this.liquidityScore -= 5;
    } else if (this.data.totalLpCount < 2) {
      this.liquidityScore -= 10;
    }

    if (this.data.largestLp) {
      const largestLpPercentage =
        (this.data.totalLiquidity / this.data.largestLp.liquidity.usd) * 100;

      if (largestLpPercentage > 90) {
        this.liquidityScore -= 15;
      } else if (largestLpPercentage > 85) {
        this.liquidityScore -= 10;
      } else if (largestLpPercentage > 80) {
        this.liquidityScore -= 5;
      } else if (largestLpPercentage < 50) {
        this.liquidityScore += 5;
      } else if (largestLpPercentage < 55) {
        this.liquidityScore += 10;
      } else if (largestLpPercentage < 60) {
        this.liquidityScore += 15;
      }
    }

    if (this.liquidityScore >= 100) return 100;
    else if (this.liquidityScore <= -100) return -100;
    return this.liquidityScore;
  }

  public getCommunityScore() {
    if (this.data.isTwitterExist) {
      this.communityScore += 10;
    } else {
      this.communityScore -= 50;
    }

    if (this.data.isTelegramExist || this.data.isDiscordExist) {
      this.communityScore += 10;
    } else {
      this.communityScore -= 50;
    }

    if (this.communityScore === -100) return -100;

    if (this.data.isTwitterVerified) {
      this.communityScore += 20;
    } else {
      this.communityScore -= 20;
    }

    if (this.data.twitterFollowers > 10000) {
      this.communityScore += 20;
    } else if (this.data.twitterFollowers > 5000) {
      this.communityScore += 15;
    } else if (this.data.twitterFollowers > 1000) {
      this.communityScore += 10;
    } else if (this.data.twitterFollowers > 500) {
      this.communityScore += 5;
    }

    if (this.data.tweetCount > 1000) {
      this.communityScore += 20;
    } else if (this.data.tweetCount > 500) {
      this.communityScore += 15;
    } else if (this.data.tweetCount > 300) {
      this.communityScore += 10;
    } else if (this.data.tweetCount > 100) {
      this.communityScore += 5;
    }

    if (this.data.mediaCount > 100) {
      this.communityScore += 10;
    } else if (this.data.mediaCount > 50) {
      this.communityScore += 5;
    }

    if (this.data.twitterLastUpdated) {
      const dateDiff = timeDifference(
        new Date(this.data.twitterLastUpdated),
        new Date(),
        "h"
      );

      if (parseInt(dateDiff) > 24) {
        this.communityScore -= 10;
      } else if (parseInt(dateDiff) > 12) {
        this.communityScore -= 5;
      } else if (parseInt(dateDiff) > 6) {
        this.communityScore += 5;
      } else if (parseInt(dateDiff) <= 3) {
        this.communityScore += 10;
      }
    }

    if (this.communityScore >= 100) return 100;
    else if (this.communityScore <= -100) return -100;
    return this.communityScore;
  }

  public getMarketScore() {
    if (this.data.m5Txns.buy > this.data.m5Txns.sell) {
      this.marketScore += 5;
    } else {
      this.marketScore -= 5;
    }

    if (this.data.h1Txns.buy > this.data.h1Txns.sell) {
      this.marketScore += 5;
    } else {
      this.marketScore -= 5;
    }
    if (this.data.h6Txns.buy > this.data.h6Txns.sell) {
      this.marketScore += 5;
    } else {
      this.marketScore -= 5;
    }
    if (this.data.h24Txns.buy > this.data.h24Txns.sell) {
      this.marketScore += 5;
    } else {
      this.marketScore -= 5;
    }

    if (
      Math.abs(this.data.volumeChange.h24 - this.data.volumeChange.h6) > 1000
    ) {
      this.marketScore -= 20;
    } else if (
      Math.abs(this.data.volumeChange.h24 - this.data.volumeChange.h6) > 500
    ) {
      this.marketScore -= 10;
    } else if (
      Math.abs(this.data.volumeChange.h24 - this.data.volumeChange.h6) < 250
    ) {
      this.marketScore += 20;
    } else if (
      Math.abs(this.data.volumeChange.h24 - this.data.volumeChange.h6) <= 500
    ) {
      this.marketScore += 10;
    }

    if (
      Math.abs(this.data.volumeChange.h6 - this.data.volumeChange.h1) > 1000
    ) {
      this.marketScore -= 20;
    } else if (
      Math.abs(this.data.volumeChange.h6 - this.data.volumeChange.h1) > 500
    ) {
      this.marketScore -= 10;
    } else if (
      Math.abs(this.data.volumeChange.h6 - this.data.volumeChange.h1) < 250
    ) {
      this.marketScore += 20;
    } else if (
      Math.abs(this.data.volumeChange.h6 - this.data.volumeChange.h1) <= 500
    ) {
      this.marketScore += 10;
    }

    if (Math.abs(this.data.priceChange.h24 - this.data.priceChange.h6) > 1000) {
      this.marketScore -= 20;
    } else if (
      Math.abs(this.data.priceChange.h24 - this.data.priceChange.h6) > 500
    ) {
      this.marketScore -= 10;
    } else if (
      Math.abs(this.data.priceChange.h24 - this.data.priceChange.h6) < 250
    ) {
      this.marketScore += 20;
    } else if (
      Math.abs(this.data.priceChange.h24 - this.data.priceChange.h6) <= 500
    ) {
      this.marketScore += 10;
    }

    if (Math.abs(this.data.priceChange.h6 - this.data.priceChange.h1) > 1000) {
      this.marketScore -= 20;
    } else if (
      Math.abs(this.data.priceChange.h6 - this.data.priceChange.h1) > 500
    ) {
      this.marketScore -= 10;
    } else if (
      Math.abs(this.data.priceChange.h6 - this.data.priceChange.h1) < 250
    ) {
      this.marketScore += 20;
    } else if (
      Math.abs(this.data.priceChange.h6 - this.data.priceChange.h1) <= 500
    ) {
      this.marketScore += 10;
    }

    if (
      this.data.h24Txns.buy > this.data.h24Txns.sell * 1.5 &&
      this.data.h6Txns.buy > this.data.h6Txns.sell * 1.5 &&
      this.data.h1Txns.buy > this.data.h1Txns.sell * 1.5
    ) {
      this.marketScore += 20;
    } else if (
      this.data.h24Txns.buy * 1.5 < this.data.h24Txns.sell &&
      this.data.h6Txns.buy * 1.5 < this.data.h6Txns.sell &&
      this.data.h1Txns.buy * 1.5 < this.data.h1Txns.sell
    ) {
      this.marketScore -= 20;
    } else if (
      this.data.h24Txns.buy > this.data.h24Txns.sell &&
      this.data.h6Txns.buy > this.data.h6Txns.sell &&
      this.data.h1Txns.buy > this.data.h1Txns.sell
    ) {
      this.marketScore += 10;
    } else if (
      this.data.h24Txns.buy < this.data.h24Txns.sell &&
      this.data.h6Txns.buy < this.data.h6Txns.sell &&
      this.data.h1Txns.buy < this.data.h1Txns.sell
    ) {
      this.marketScore -= 10;
    }

    if (
      Math.abs(this.data.priceChange.h24 - this.data.volumeChange.h24) > 100
    ) {
      this.marketScore -= 10;
    } else if (
      Math.abs(this.data.priceChange.h24 - this.data.volumeChange.h24) >= 50
    ) {
      this.marketScore -= 5;
    } else if (
      Math.abs(this.data.priceChange.h24 - this.data.volumeChange.h24) < 25
    ) {
      this.marketScore += 10;
    } else if (
      Math.abs(this.data.priceChange.h24 - this.data.volumeChange.h24) < 50
    ) {
      this.marketScore += 5;
    }

    if (Math.abs(this.data.priceChange.h6 - this.data.volumeChange.h6) > 100) {
      this.marketScore -= 10;
    } else if (
      Math.abs(this.data.priceChange.h6 - this.data.volumeChange.h6) >= 50
    ) {
      this.marketScore -= 5;
    } else if (
      Math.abs(this.data.priceChange.h6 - this.data.volumeChange.h6) < 25
    ) {
      this.marketScore += 10;
    } else if (
      Math.abs(this.data.priceChange.h6 - this.data.volumeChange.h6) < 50
    ) {
      this.marketScore += 5;
    }

    if (Math.abs(this.data.priceChange.h1 - this.data.volumeChange.h1) > 100) {
      this.marketScore -= 10;
    } else if (
      Math.abs(this.data.priceChange.h1 - this.data.volumeChange.h1) >= 50
    ) {
      this.marketScore -= 5;
    } else if (
      Math.abs(this.data.priceChange.h1 - this.data.volumeChange.h1) < 25
    ) {
      this.marketScore += 10;
    } else if (
      Math.abs(this.data.priceChange.h1 - this.data.volumeChange.h1) < 50
    ) {
      this.marketScore += 5;
    }

    if (this.marketScore >= 100) return 100;
    else if (this.marketScore <= -100) return -100;
    return this.marketScore;
  }

  public getMetadataScore() {
    if (this.data.mutability) {
      this.metadataScore -= 10;
    } else {
      this.metadataScore += 10;
    }

    if (this.data.mintability) {
      this.metadataScore -= 10;
    } else {
      this.metadataScore += 10;
    }

    if (this.data.freezability) {
      this.metadataScore += 10;
    } else {
      this.metadataScore += 10;
    }

    if (this.data.creatorLock.isLocked) {
      this.metadataScore += 20;
    }

    if (this.data.creatorTransfer.length > 0) {
      this.metadataScore -= 50;
    }
    if (this.data.creatorSellCount > 0) {
      this.metadataScore -= 50;
    }

    if (this.metadataScore >= 100) return 100;
    else if (this.metadataScore <= -100) return -100;
    return this.metadataScore;
  }

  public getWebsiteScore() {
    for (const website of this.data.websiteShape) {
      if (website.ip) {
        this.websiteScore += 10;
        if (website.name && website.name !== "") {
          this.websiteScore += 5;
        }
        if (website.description && website.description === "") {
          this.websiteScore += 5;
        }
        if (website.author && website.author !== "") {
          this.websiteScore += 5;
        }
        if (website.keywords && website.keywords !== "") {
          this.websiteScore += 5;
        }
      }
    }

    if (this.websiteScore >= 100) return 100;
    else if (this.websiteScore <= -100) return -100;
    return this.websiteScore;
  }

  public getGithubScore() {
    for (const github of this.data.githubShape) {
      this.githubScore += 10;
      if (github.stargazersCount >= 100) {
        this.githubScore += 20;
      } else if (github.stargazersCount >= 50) {
        this.githubScore += 15;
      } else if (github.stargazersCount >= 25) {
        this.githubScore += 10;
      } else if (github.stargazersCount >= 10) {
        this.githubScore += 5;
      }
      if (github.watchersCount >= 100) {
        this.githubScore += 20;
      } else if (github.watchersCount >= 50) {
        this.githubScore += 15;
      } else if (github.watchersCount >= 25) {
        this.githubScore += 10;
      } else if (github.watchersCount >= 10) {
        this.githubScore += 5;
      }
      if (github.forkCount >= 100) {
        this.githubScore += 20;
      } else if (github.forkCount >= 50) {
        this.githubScore += 15;
      } else if (github.forkCount >= 25) {
        this.githubScore += 10;
      } else if (github.forkCount >= 10) {
        this.githubScore += 5;
      }
      if (github.openIssueCount >= 100) {
        this.githubScore += 20;
      } else if (github.openIssueCount >= 50) {
        this.githubScore += 15;
      } else if (github.openIssueCount >= 25) {
        this.githubScore += 10;
      } else if (github.openIssueCount >= 10) {
        this.githubScore += 5;
      }

      if (github.hasWiki) {
        this.githubScore += 5;
      }
      if (github.hasProjects) {
        this.githubScore += 5;
      }
      if (github.hasPages) {
        this.githubScore += 5;
      }
      if (github.hasDiscussions) {
        this.githubScore += 5;
      }
      if (github.hasIssues) {
        this.githubScore += 5;
      }
      if (github.hasDownloads) {
        this.githubScore += 5;
      }
      if (github.visibility === "public") {
        this.githubScore += 5;
      } else {
        this.githubScore -= 5;
      }
    }

    if (this.githubScore >= 100) return 100;
    else if (this.githubScore <= -100) return -100;
    return this.githubScore;
  }
}
