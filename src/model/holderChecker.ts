import { BaseChecker } from "@/src/model/baseChecker";
import { Connection, PublicKey } from "@solana/web3.js";

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

  async check() {
    // const supply = await this.getTokenSupply();
    const supply = await this.getTokenSupply();

    console.log(supply);
  }

  async getTokenSupply() {
    try {
      const { amount: supply } = (
        await this.connection.getTokenSupply(this.address)
      ).value;

      if (!supply) throw new Error("Failed to get token supply");

      return supply;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get token supply");
    }
  }

  async getTopHolders() {
    try {
      const holders = await (
        await this.connection.getTokenLargestAccounts(this.address)
      ).value;

      if (!holders || holders.length === 0) throw new Error("No holders found");

      return holders;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get top holders");
    }
  }
}
