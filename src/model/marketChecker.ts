import { BaseChecker } from "@/src/model/baseChecker";
import { Connection } from "@solana/web3.js";
import { DexScreenerGetter } from "../module/dexScreenerGetter";
import { DexScreenerResponseShape } from "../types/dex";

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

  public async getLargePool() {
    const response: DexScreenerResponseShape[] =
      await new DexScreenerGetter().getTokenSearchAddress(this.address);

    const largest = response.sort(
      (a, b) => b.liquidity.usd - a.liquidity.usd
    )[0];

    return largest;
  }
}
