import { BaseCheckResult } from "@/src/data/result/baseCheckResult";
import { HolderData } from "@/src/types/holder";

interface IHolderCheckResult {}

/**
 * HolderCheckResult
 * @implements {IHolderCheckResult}
 * @description This class is responsible for checking the holder of a project.
 * It should check if the project has a holder.
 */

export class HolderCheckResult
  extends BaseCheckResult
  implements IHolderCheckResult
{
  holderCount: number;
  top10Percentage: number;
  creatorPercentage: number;
  creatorBalance: number;
  topHolderValidation: { address: string; isValid: boolean }[];

  constructor() {
    const score = 0;
    super(score);
    this.holderCount = 0;
    this.top10Percentage = 0;
    this.creatorPercentage = 0;
    this.creatorBalance = 0;
    this.topHolderValidation = [];
  }

  public async setDate({ holderData }: { holderData: HolderData }) {
    this.holderCount = holderData.totalHolderCount;
    this.top10Percentage = holderData.top10.percentage;
    this.creatorPercentage = holderData.creatorPercentage;
    this.creatorBalance = holderData.creatorBalance;
    this.topHolderValidation = holderData.topHolderValidation;
  }

  public async getScore() {
    if (this.holderCount < 1000) {
      this.score -= 10;
    } else {
      const score = this.holderCount / 100;
      this.score += score;
    }

    if (this.top10Percentage > 30) {
      this.score -= 20;
    } else if (this.top10Percentage > 25) {
      this.score -= 15;
    } else if (this.top10Percentage > 20) {
      this.score -= 10;
    } else if (this.top10Percentage < 15) {
      this.score += 10;
    } else if (this.top10Percentage < 10) {
      this.score += 15;
    } else if (this.top10Percentage < 5) {
      this.score += 20;
    }

    for (const holder of this.topHolderValidation) {
      if (!holder.isValid) {
        this.score -= 5;
      }
    }

    if (this.creatorPercentage > 30) {
      this.score -= 20;
    } else if (this.creatorPercentage > 25) {
      this.score -= 15;
    } else if (this.creatorPercentage > 20) {
      this.score -= 10;
    } else if (this.creatorPercentage > 15) {
      this.score += 10;
    } else if (this.creatorPercentage > 10) {
      this.score += 15;
    } else if (this.creatorPercentage > 5) {
      this.score += 20;
    }

    if (this.score >= 100) return 100;
    else if (this.score <= -100) return -100;
    return this.score;
  }
}
