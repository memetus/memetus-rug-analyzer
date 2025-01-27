import { BaseCheckResult } from "@/src/data/result/baseCheckResult";
import {
  LiquidityData,
  LiquidityLockedInfo,
  LPInfo,
} from "@/src/types/liquidity";

interface ILiquidityCheckResult {}

/**
 * LiquidityCheckResult
 * @implements {ILiquidityCheckResult}
 * @description This class is responsible for checking the liquidity of a project.
 * It should check if the project has a liquidity.
 */

export class LiquidityCheckResult
  extends BaseCheckResult
  implements ILiquidityCheckResult
{
  totalLiquidity: number;
  totalLpCount: number;
  totalLockedLiquidity: number;
  totalLockedLiquidityPercentage: number;
  lpLockedInfoList: (LiquidityLockedInfo | undefined)[];
  lpList: (LPInfo | undefined)[];
  largestLp: LPInfo | undefined;
  marketCap: number;

  constructor() {
    const score = 0;
    super(score);

    this.totalLiquidity = 0;
    this.totalLpCount = 0;
    this.totalLockedLiquidity = 0;
    this.totalLockedLiquidityPercentage = 0;
    this.lpLockedInfoList = [];
    this.lpList = [];
    this.largestLp = undefined;
    this.marketCap = 0;
  }

  public async setData({
    totalLiquidity,
    totalLpCount,
    totalLockedLiquidity,
    totalLockedLiquidityPercentage,
    lpLockedInfoList,
    lpList,
    marketCap,
  }: LiquidityData) {
    this.totalLiquidity = totalLiquidity;
    this.totalLpCount = totalLpCount;
    this.totalLockedLiquidity = totalLockedLiquidity;
    this.totalLockedLiquidityPercentage = totalLockedLiquidityPercentage;
    this.lpLockedInfoList = lpLockedInfoList;
    this.lpList = lpList;
    this.marketCap = marketCap ?? 0;

    const largestLp = this.lpList.reduce((max, current) => {
      if (max && current) {
        return current.lpPercentage > max.lpPercentage ? current : max;
      }
    });
    this.largestLp = largestLp;
  }

  public async getScore() {
    if (this.marketCap / 20 < this.totalLiquidity) {
      this.score += 20;
    } else if (this.marketCap / 15 < this.totalLiquidity) {
      this.score += 15;
    } else if (this.marketCap / 10 < this.totalLiquidity) {
      this.score += 10;
    } else if (this.marketCap / 5 < this.totalLiquidity) {
      this.score -= 10;
    } else if (this.marketCap / 5 > this.totalLiquidity) {
      this.score -= 15;
    }

    if (this.totalLpCount >= 5) {
      this.score += 15;
    } else if (this.totalLpCount >= 4) {
      this.score += 10;
    } else if (this.totalLpCount >= 3) {
      this.score += 5;
    } else if (this.totalLpCount >= 2) {
      this.score -= 5;
    } else if (this.totalLpCount < 2) {
      this.score -= 10;
    }

    if (this.largestLp) {
      if (this.largestLp.lpPercentage > 90) {
        this.score -= 15;
      } else if (this.largestLp.lpPercentage > 85) {
        this.score -= 10;
      } else if (this.largestLp.lpPercentage > 80) {
        this.score -= 5;
      } else if (this.largestLp.lpPercentage < 50) {
        this.score += 5;
      } else if (this.largestLp.lpPercentage < 55) {
        this.score += 10;
      } else if (this.largestLp.lpPercentage < 60) {
        this.score += 15;
      }
    }

    const score = await this._getScore();
    if (score > 100) return 100;
    else if (score < -100) return -100;
    return score;
  }
}
