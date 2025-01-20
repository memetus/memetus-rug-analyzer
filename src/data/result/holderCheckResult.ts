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
  constructor(score: number) {
    super(score);
  }
}
