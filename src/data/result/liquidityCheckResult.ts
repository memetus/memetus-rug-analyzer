import { BaseCheckResult } from "@/src/data/result/baseCheckResult";
import { LiquidityLockedInfo, LPInfo } from "@/src/types/liquidity";

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
  lpLockedInfoList: LiquidityLockedInfo[];
  lpList: LPInfo[];

  constructor() {
    const score = 0;
    super(score);

    this.totalLiquidity = 0;
    this.totalLpCount = 0;
    this.totalLockedLiquidity = 0;
    this.lpLockedInfoList = [];
    this.lpList = [];
  }
}
