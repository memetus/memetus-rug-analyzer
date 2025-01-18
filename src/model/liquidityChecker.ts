import { BaseChecker } from "@/src/model/baseChecker";

interface ILiquidityChecker {}

/**
 * LiquidityChecker
 * @implements {ILiquidityChecker}
 * @description This class is responsible for checking the liquidity stability of a project.
 * It should check if the project has a liquidity pool and if it is locked.
 */
export class LiquidityChecker
  extends BaseChecker
  implements ILiquidityChecker {}
