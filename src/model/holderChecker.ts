import { BaseChecker } from "@/src/model/baseChecker";
import { Connection, ParsedAccountData, PublicKey } from "@solana/web3.js";
import { DexSupplyShape } from "@/src/types/dex";
import { AddressChecker } from "@/src/module/addressChecker";
import { TopHolderSupplyShape } from "@/src/types/holder";

interface IHolderChecker {}

/**
 * HolderChecker
 * @implements {IHolderChecker}
 * @description This class is responsible for checking the holder of a project.
 * It should check Distribution and Stability of the token holder.
 */
export class HolderChecker extends BaseChecker implements IHolderChecker {
  address: PublicKey;
  connection: Connection;

  constructor(address: string, connection: Connection) {
    super();
    this.address = new PublicKey(address);
    this.connection = connection;
  }

  async check() {}

  private async getTokenSupply() {
    try {
      const { uiAmount: supply } = (
        await this.connection.getTokenSupply(this.address)
      ).value;

      if (!supply) throw new Error("Failed to get token supply");

      return supply;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get token supply");
    }
  }

  private async getHolders(range?: number) {
    try {
      const holders = await (
        await this.connection.getTokenLargestAccounts(this.address)
      ).value;

      if (!holders || holders.length === 0) throw new Error("No holders found");

      if (!range) return holders;

      return holders.slice(0, range);
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get top holders");
    }
  }

  private async getHolderData() {
    const totalSupply = await this.getTokenSupply();
    const holders = await this.getHolders(20);

    const dexSupplys: DexSupplyShape[] = [];
    const topHolderSupplys: TopHolderSupplyShape[] = [];

    for (const holder of holders) {
      const account = await this.connection.getParsedAccountInfo(
        holder.address
      );
      const address = (account.value?.data as ParsedAccountData)?.parsed?.info
        ?.owner;

      const isDexAddress = new AddressChecker(address).isDexAddress();
      if (holder.uiAmount && address && !isDexAddress.isDex) {
        topHolderSupplys.push({
          address,
          amount: holder.uiAmount,
          percentage: (holder.uiAmount / totalSupply) * 100,
        });
      } else if (
        holder.uiAmount &&
        address &&
        isDexAddress.isDex &&
        isDexAddress.name
      ) {
        dexSupplys.push({
          name: isDexAddress.name,
          amount: holder.uiAmount,
        });
      }
    }

    const dexPercentage =
      (dexSupplys.reduce((acc, cur) => acc + cur.amount, 0) / totalSupply) *
      100;
    const topHolderPercentage =
      (topHolderSupplys.reduce((acc, cur) => acc + cur.amount, 0) /
        totalSupply) *
      100;

    return {
      dexPercentage,
      topHolderPercentage,
      dexSupplys,
      topHolderSupplys,
    };
  }
}
