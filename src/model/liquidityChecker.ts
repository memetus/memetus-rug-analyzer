import { BaseChecker } from "@/src/model/baseChecker";
import { Connection, ParsedAccountData, PublicKey } from "@solana/web3.js";
import { DexScreenerGetter } from "@/src/module/dexScreenerGetter";
import { DexScreenerResponseShape } from "@/src/types/dex";
import { LIQUIDITY_STATE_LAYOUT_V4 } from "@raydium-io/raydium-sdk";
import { LiquidityCheckResult } from "@/src/data/result/liquidityCheckResult";
import { LiquidityData } from "../types/liquidity";

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
    const checkResult = new LiquidityCheckResult();
    const liquidityData = await this.getPoolInfo();
    let totalLockedAmount = 0;
    let totalLockedPercentage = 0;
    const marketCap = liquidityData.dexList[0]?.marketCap;

    const lpLockedInfoList = await Promise.all(
      liquidityData.dexList.slice(0, 5).map(async (lp) => {
        if (lp) {
          const lockedInfo = await this.checkTokenLocked(lp.pair);
          totalLockedAmount += lockedInfo?.burnAmount ?? 0;
          totalLockedPercentage += lockedInfo?.burnPercentage ?? 0;

          return lockedInfo;
        }
      })
    );

    const data: LiquidityData = {
      totalLiquidity: liquidityData.totalDexLiquidity,
      totalLpCount: liquidityData.dexList.length,
      lpList: liquidityData.dexList,
      lpLockedInfoList: lpLockedInfoList,
      totalLockedLiquidity: totalLockedAmount,
      totalLockedLiquidityPercentage: totalLockedPercentage,
      marketCap,
    };

    return checkResult.setData({ ...data }).then(async () => {
      return await checkResult.getScore();
    });
  }

  public async getPoolInfo() {
    const dexList: DexScreenerResponseShape[] =
      await this.getDexPoolList().then((list: DexScreenerResponseShape[]) => {
        return list.sort((a, b) => b.marketCap - a.marketCap);
      });
    const pairList: string[] = [];
    let totalLiquidity = 0;

    dexList.forEach((dex) => {
      if (dex.liquidity && "usd" in dex.liquidity) {
        totalLiquidity += dex.liquidity.usd;
      }
    });

    const result = dexList?.map((dex) => {
      if (!pairList.includes(dex.quoteToken.address)) {
        pairList.push(dex.quoteToken.address);
      }
      if (dex.liquidity && "usd" in dex.liquidity) {
        totalLiquidity += dex.liquidity.usd;
        return {
          name: dex.dexId,
          pair: dex.pairAddress,
          marketCap: dex.marketCap,
          liquidity: dex.liquidity.usd,
          lpPercentage: (dex.liquidity.usd / totalLiquidity) * 100,
        };
      }
    });

    return {
      pairType: pairList,
      pairTypeCount: pairList.length,
      totalDexLiquidity: totalLiquidity,
      dexList: result.filter((v) => v && v),
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

      if (!accInfo || !accInfo.value) {
        return {
          supply: 0,
          burnAmount: 0,
          burnPercentage: 0,
          isLocked: false,
          pair,
        };
      }
      const mintInfo = (accInfo?.value?.data as ParsedAccountData).parsed?.info;

      lpReserve = lpReserve / Math.pow(10, mintInfo?.decimals);
      const supply = mintInfo?.supply / Math.pow(10, mintInfo?.decimals);
      const burnAmt = lpReserve - supply;
      const burnPct = (burnAmt / lpReserve) * 100;

      return {
        supply: supply,
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
