import { BaseChecker } from "@/src/model/baseChecker";
import { Connection, ParsedAccountData, PublicKey } from "@solana/web3.js";
import { DexSupplyShape } from "@/src/types/dex";
import { AddressChecker } from "@/src/module/addressChecker";
import { TopHolderSupplyShape } from "@/src/types/holder";
import { createUmiEndpoint } from "../config/chain";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { parseTokenAccountData } from "../lib/parseAccount";

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

  public async getTokenCreaetionSignature() {
    const pda = await new AddressChecker(
      this.address.toBase58()
    ).getMetaplexPda();

    if (!pda) throw new Error("Failed to get pda");
    const signatures = await this.connection.getSignaturesForAddress(pda, {});

    if (!signatures || signatures.length === 0 || !signatures[0]) {
      throw new Error("No signatures found");
    }

    return signatures[signatures.length - 1].signature;
  }

  public async getTokenCreator() {
    const signature = await this.getTokenCreaetionSignature();

    const transaction = await this.connection.getParsedTransaction(signature, {
      maxSupportedTransactionVersion: 0,
    });

    if (!transaction) throw new Error("Failed to get transaction");

    const creator =
      transaction.transaction.message.accountKeys[0].pubkey.toBase58();

    return creator;
  }

  private async getHolders(range?: number) {
    try {
      const holders = (
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

  public async getTopHolderValidation() {
    const holderData = await this.getHolderData();
    const holderTokenData = [];

    for (const holder of holderData.topHolderSupplys) {
      const tokens = await this.connection.getTokenAccountsByOwner(
        new PublicKey(holder.address),
        {
          programId: new PublicKey(TOKEN_PROGRAM_ID),
        }
      );

      if (tokens && tokens.value.length !== 0) {
        holderTokenData.push({
          address: holder.address,
          isValid: true,
        });
      } else
        holderTokenData.push({
          address: holder.address,
          isValid: false,
        });
    }

    return holderTokenData;
  }
}
