import { BaseCheckResult } from "./baseCheckResult";

interface IMarketCheckResult {}

/**
 * MarketCheckResult
 * @implements {IMarketCheckResult}
 * @description This class is responsible for checking the market of a project.
 * It should check if the project has a market.
 */

export class MarketCheckResult
  extends BaseCheckResult
  implements IMarketCheckResult
{
  constructor(score: number) {
    super(score);
  }
}
