import { BaseChecker } from "@/src/model/baseChecker";
import { Connection } from "@solana/web3.js";
import { DexScreenerGetter } from "@/src/module/dexScreenerGetter";
import { DexScreenerResponseShape } from "@/src/types/dex";
import { BaseGrowth } from "@/src/data/baseGrowth";

interface IMarketChecker {}

/**
 * MarketChecker
 * @implements {IMarketChecker}
 * @description This class is responsible for checking the market of a project.
 * It should check the project's market cap, volume, and price.
 */
export class MarketChecker extends BaseChecker implements IMarketChecker {
  address: string;
  connection: Connection;

  constructor(address: string, connection: Connection) {
    super();
    this.address = address;
    this.connection = connection;
  }

  public async getMarketData() {
    const pool = await this.getLargePool();

    return {
      name: pool.baseToken.name,
      symbol: pool.baseToken.symbol,
      address: pool.baseToken.address,
      pair: pool.pairAddress,
      priceNative: pool.priceNative,
      priceUsd: pool.priceUsd,
      transactions: pool.txns,
      volume: pool.volume,
      fdv: pool.fdv,
      liquidity: pool.liquidity,
      priceChange: pool.priceChange,
      marketCap: pool.marketCap,
    };
  }

  public async checkPrice(pool: DexScreenerResponseShape) {
    const { priceChange } = pool;

    return priceChange;
  }

  public async checkVolume(pool: DexScreenerResponseShape) {
    const volumeIncrease = this.getVolumeIncrease(pool);

    return volumeIncrease;
  }

  public async checkTransactions(pool: DexScreenerResponseShape) {
    return pool.txns;
  }

  public async checkPriceVolume(pool: DexScreenerResponseShape) {
    const volumeIncrease = this.getVolumeIncrease(pool);
    const { priceChange } = pool;

    const baseGrowth = new BaseGrowth();

    if (volumeIncrease.h24 && priceChange.h24) {
      baseGrowth.h24 = {
        volume: volumeIncrease.h24,
        price: priceChange.h24,
        gap: volumeIncrease.h24 - priceChange.h24,
        faster: volumeIncrease.h24 > priceChange.h24 ? "volume" : "price",
      };
    }
    if (volumeIncrease.h6 && priceChange.h6) {
      baseGrowth.h6 = {
        volume: volumeIncrease.h6,
        price: priceChange.h6,
        gap: volumeIncrease.h6 - priceChange.h6,
        faster: volumeIncrease.h6 > priceChange.h6 ? "volume" : "price",
      };
    }
    if (volumeIncrease.h1 && priceChange.h1) {
      baseGrowth.h1 = {
        volume: volumeIncrease.h1,
        price: priceChange.h1,
        gap: volumeIncrease.h1 - priceChange.h1,
        faster: volumeIncrease.h1 > priceChange.h1 ? "volume" : "price",
      };
    }

    return baseGrowth;
  }

  public getVolumeIncrease(pool: DexScreenerResponseShape) {
    const { volume } = pool;

    function calculateGrowthRate(
      current: number,
      previous: number
    ): number | null {
      if (previous === 0) {
        return null;
      }
      return (current / previous) * 100;
    }

    const growthRates = {
      h24: calculateGrowthRate(volume.h6, volume.h24),
      h6: calculateGrowthRate(volume.h1, volume.h6),
      h1: calculateGrowthRate(volume.m5, volume.h1),
    };

    return growthRates;
  }

  public async getLargePool() {
    const response: DexScreenerResponseShape[] =
      await new DexScreenerGetter().getTokenSearchAddress(this.address);

    const largest = response.sort(
      (a, b) => b.liquidity.usd - a.liquidity.usd
    )[0];

    return largest;
  }
}
