import { BaseCheckResult } from "./baseCheckResult";

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
  topHolderValidation: number;

  constructor(score: number) {
    super(score);
    this.holderCount = 0;
    this.top10Percentage = 0;
    this.top20Percentage = 0;
    this.top50Percentage = 0;
    this.topHolderValidation = 0;
  }
}
