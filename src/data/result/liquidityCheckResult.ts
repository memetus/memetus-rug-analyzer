import { BaseCheckResult } from "./baseCheckResult";

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
  constructor(score: number) {
    super(score);
  }
}
