import { BaseChecker } from "@/src/model/baseChecker";
import { Connection, ParsedAccountData, PublicKey } from "@solana/web3.js";
import { DexScreenerGetter } from "@/src/module/dexScreenerGetter";
import { DexScreenerResponseShape } from "@/src/types/dex";
import { LIQUIDITY_STATE_LAYOUT_V4 } from "@raydium-io/raydium-sdk";

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

  public async check() {}

  public async getPoolInfo() {
    const dexList: DexScreenerResponseShape[] = await this.getDexPoolList();
    const pairList: string[] = [];
    const totalLiquidity = dexList.reduce((acc, dex) => {
      return dex.liquidity.usd + acc;
    }, 0);

    const result = dexList.map((dex) => {
      if (!pairList.includes(dex.quoteToken.address)) {
        pairList.push(dex.quoteToken.address);
      }
      return {
        name: dex.dexId,
        pair: dex.pairAddress,
        liquidity: dex.liquidity.usd,
        liquidityPercentage: (dex.liquidity.usd / totalLiquidity) * 100,
      };
    });

    return {
      pairType: pairList,
      pairTypeCount: pairList.length,
      totalDexLiquidity: totalLiquidity,
      dexList: result,
    };
  }

  public async checkTokenLocked(pair: string) {
    const acc = await this.connection.getMultipleAccountsInfo([
      new PublicKey(pair),
    ]);
    const parsed = acc.map(
      (v) => v && LIQUIDITY_STATE_LAYOUT_V4.decode(v.data)
    );
    if (parsed && parsed[0]) {
      const lpMint = parsed[0].lpMint;
      let lpReserve = parsed[0]?.lpReserve.toNumber() ?? 0;
      const accInfo = await this.connection.getParsedAccountInfo(
        new PublicKey(lpMint)
      );

      const mintInfo = (accInfo?.value?.data as ParsedAccountData).parsed?.info;

      lpReserve = lpReserve / Math.pow(10, mintInfo?.decimals);
      const actualSupply = mintInfo?.supply / Math.pow(10, mintInfo?.decimals);
      const burnAmt = lpReserve - actualSupply;
      const burnPct = (burnAmt / lpReserve) * 100;

      return {
        burnAmount: burnAmt,
        burnPercentage: burnPct,
        isLocked: burnPct === 100 ? true : false,
        pair,
      };
    }
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
