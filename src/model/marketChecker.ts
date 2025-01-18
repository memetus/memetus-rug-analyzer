import { BaseChecker } from "@/src/model/baseChecker";

interface IMarketChecker {}

/**
 * MarketChecker
 * @implements {IMarketChecker}
 * @description This class is responsible for checking the market of a project.
 * It should check the project's market cap, volume, and price.
 */
export class MarketChecker extends BaseChecker implements IMarketChecker {}
