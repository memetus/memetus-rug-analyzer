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
  top20Percentage: number;
  top50Percentage: number;
  creatorPercentage: number;
  creatorBalance: number;
  topHolderValidation: { address: string; isValid: boolean }[];

  constructor() {
    const score = 0;
    super(score);
    this.holderCount = 0;
    this.top10Percentage = 0;
    this.top20Percentage = 0;
    this.top50Percentage = 0;
    this.creatorPercentage = 0;
    this.creatorBalance = 0;
    this.topHolderValidation = [];
  }

  public async setDate({ holderData }: { holderData: HolderData }) {
    this.holderCount = holderData.totalHolderCount;
    this.top10Percentage = holderData.top10.percentage;
    this.top20Percentage = holderData.top20.percentage;
    this.top50Percentage = holderData.top50.percentage;
    this.creatorPercentage = holderData.creatorPercentage;
    this.creatorBalance = holderData.creatorBalance;
    this.topHolderValidation = holderData.topHolderValidation;
  }

  public async getScore() {
    if (this.holderCount > 10000) {
      this.score += 20;
    } else if (this.holderCount > 5000) {
      this.score += 15;
    } else if (this.holderCount > 1000) {
      this.score += 10;
    }

    if (this.holderCount < 1000) {
      this.score -= 10;
    } else if (this.holderCount < 500) {
      this.score -= 15;
    } else if (this.holderCount < 100) {
      this.score -= 20;
    }

    if (this.top10Percentage > 50) {
      this.score -= 20;
    } else if (this.top10Percentage > 40) {
      this.score -= 15;
    } else if (this.top10Percentage > 30) {
      this.score -= 10;
    } else if (this.top10Percentage > 20) {
      this.score += 10;
    } else {
      this.score += 15;
    }

    if (this.top20Percentage > 70) {
      this.score -= 20;
    } else if (this.top20Percentage > 60) {
      this.score -= 15;
    } else if (this.top20Percentage > 50) {
      this.score -= 10;
    } else if (this.top20Percentage > 40) {
      this.score += 10;
    } else {
      this.score += 15;
    }

    if (this.top50Percentage > 90) {
      this.score -= 20;
    } else if (this.top50Percentage > 80) {
      this.score -= 15;
    } else if (this.top50Percentage > 70) {
      this.score -= 10;
    } else if (this.top50Percentage > 60) {
      this.score += 10;
    } else {
      this.score += 15;
    }

    this.topHolderValidation.forEach((holder) => {
      if (!holder.isValid) {
        this.score -= 5;
      }
    });

    this.creatorPercentage > 30
      ? (this.score -= 20)
      : this.creatorBalance === 0
      ? (this.score -= 10)
      : (this.score += 20);

    const score = await this._getScore();
    if (score > 100) return 100;
    else if (score < -100) return -100;
    return score;
  }
}
