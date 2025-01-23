import { Txn, Volume, DataChangeShpae } from "@/src/types/market";
import { BaseCheckResult } from "@/src/data/result/baseCheckResult";
import { BaseGrowth } from "@/src/data/baseGrowth";

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
  priceNative: number;
  priceUsd: number;
  m5Txns: Txn;
  h1Txns: Txn;
  h6Txns: Txn;
  h24Txns: Txn;
  volume: Volume;
  volumeChange: DataChangeShpae;
  priceChange: DataChangeShpae;
  marketCap: number;
  fdv: number;
  marketGrowth: BaseGrowth;

  constructor() {
    const score = 0;
    super(score);
    this.priceNative = 0;
    this.priceUsd = 0;
    this.m5Txns = {
      buy: 0,
      sell: 0,
    };
    this.h1Txns = {
      buy: 0,
      sell: 0,
    };
    this.h6Txns = {
      buy: 0,
      sell: 0,
    };
    this.h24Txns = {
      buy: 0,
      sell: 0,
    };
    this.volume = {
      m5: 0,
      h1: 0,
      h6: 0,
      h24: 0,
    };
    this.volumeChange = {
      h1: 0,
      h6: 0,
      h24: 0,
    };
    this.priceChange = {
      h1: 0,
      h6: 0,
      h24: 0,
    };
    this.marketCap = 0;
    this.fdv = 0;
    this.marketGrowth = new BaseGrowth();
  }
}
