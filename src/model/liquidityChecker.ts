import { BaseChecker } from "@/src/model/baseChecker";
import { Connection, PublicKey } from "@solana/web3.js";
import { DexScreenerGetter } from "@/src/module/dexScreenerGetter";
import { DexScreenerResponseShape } from "@/src/types/dex";

interface ILiquidityChecker {}

/**
 * LiquidityChecker
 * @implements {ILiquidityChecker}
 * @description This class is responsible for checking the liquidity stability of a project.
 * It should check if the project has a liquidity pool and if it is locked.
 */
export class LiquidityChecker extends BaseChecker implements ILiquidityChecker {
  address: string;
  connection: Connection;

  constructor(address: string, connection: Connection) {
    super();
    this.address = address;
    this.connection = connection;
  }

  public async check() {
    this.getPoolInfo();
  }

  private async getPoolInfo() {
    const dexList: DexScreenerResponseShape[] = await this.getDexPoolList();
    const totalLiquidity = dexList.reduce((acc, dex) => {
      return dex.liquidity.usd + acc;
    }, 0);

    return dexList.map((dex) => {
      return {
        name: dex.dexId,
        pair: dex.pairAddress,
        liquidity: dex.liquidity.usd,
        liquidityPercentage: (dex.liquidity.usd / totalLiquidity) * 100,
      };
    });
  }

  private async getDexPoolList() {
    try {
      const dexList = await new DexScreenerGetter().getTokenSearchAddress(
        this.address
      );

      return dexList;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get Raydium pool");
    }
  }
}
