import { Txn, Volume, DataChangeShpae, MarketData } from "@/src/types/market";
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

  public async setData({ data }: { data: MarketData }) {
    this.priceNative = data.priceNative;
    this.priceUsd = data.priceUsd;
    this.m5Txns = data.m5Txns;
    this.h1Txns = data.h1Txns;
    this.h6Txns = data.h6Txns;
    this.h24Txns = data.h24Txns;
    this.volume = data.volume;
    this.priceChange = data.priceChange;
    this.marketCap = data.marketCap;
    this.fdv = data.fdv;
    this.volumeChange = data.volumeChange;
    this.marketGrowth = data.marketGrowth;
  }

  public async getScore() {
    if (
      this.h24Txns.buy > this.h24Txns.sell &&
      this.h6Txns.buy > this.h6Txns.sell &&
      this.h1Txns.buy > this.h1Txns.sell
    ) {
      this.score += 10;
      if (this.h24Txns.buy > this.h24Txns.sell * 1.5) {
        this.score += 10;
      }
      if (this.h24Txns.buy < this.h6Txns.buy) {
        this.score += 10;
      }
      if (this.h6Txns.buy < this.h1Txns.buy) {
        this.score += 10;
      }
    } else if (
      this.h24Txns.buy < this.h24Txns.sell &&
      this.h6Txns.buy < this.h6Txns.sell &&
      this.h1Txns.buy < this.h1Txns.sell
    ) {
      this.score -= 10;
      if (this.h24Txns.buy * 1.5 < this.h24Txns.sell) {
        this.score -= 10;
      }
      if (this.h24Txns.sell < this.h6Txns.sell) {
        this.score -= 10;
      }
      if (this.h6Txns.sell < this.h1Txns.sell) {
        this.score -= 10;
      }
    }

    if (this.volume.h24 > this.volume.h6 && this.volume.h6 > this.volume.h1) {
      this.score -= 10;
      if (this.volume.h24 > this.volume.h6 * 1.5) {
        this.score -= 10;
      }
      if (this.volume.h6 > this.volume.h1 * 1.5) {
        this.score -= 10;
      }
    } else if (
      this.volume.h24 < this.volume.h6 &&
      this.volume.h6 < this.volume.h1
    ) {
      this.score += 10;
      if (this.volume.h24 * 1.5 < this.volume.h6) {
        this.score += 10;
      }
      if (this.volume.h6 * 1.5 < this.volume.h1) {
        this.score += 10;
      }
    }

    if (this.priceChange.h24 > 0) {
      if (this.priceChange.h24 < this.priceChange.h6) {
        this.score += 10;
      }
      if (this.priceChange.h6 < this.priceChange.h1) {
        this.score += 10;
      }
    } else if (this.priceChange.h24 < 0) {
      if (this.priceChange.h24 > this.priceChange.h6) {
        this.score -= 10;
      }
      if (this.priceChange.h6 > this.priceChange.h1) {
        this.score -= 10;
      }
    }

    if (this.score > 100) return 100;
    else if (this.score < -100) return -100;
    return this.score;
  }
}
