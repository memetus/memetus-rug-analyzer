import { BaseChecker } from "@/src/model/baseChecker";
import { Connection, ParsedAccountData, PublicKey } from "@solana/web3.js";
import { DexSupplyShape } from "@/src/types/dex";
import { AddressChecker } from "@/src/module/addressChecker";
import { HolderData, TopHolderSupplyShape } from "@/src/types/holder";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { logger } from "@/src/config/log";
import { HeliusModule } from "@/src/module/heliusModule";
import { HolderCheckResult } from "@/src/data/result/holderCheckResult";
import { parseTokenAccountData } from "@/src/lib/parseAccount";

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

  public async check() {
    const checkResult = new HolderCheckResult();
    const totalSupply = await this.getTokenSupply();
    const { count } = await this.getHolderCount();
    const holderData = await this.getHolderData(totalSupply, 10);
    const holderValidation = await this.getTopHolderValidation(
      holderData.top10
    );
    const { balance, percentage } = await this.getCreatorInfo(totalSupply);

    const data: HolderData = {
      totalHolderCount: count,
      topHolderValidation: holderValidation,
      creatorBalance: balance,
      creatorPercentage: percentage,
      ...holderData,
    };

    return checkResult.setDate({ holderData: data }).then(async () => {
      const score = await checkResult.getScore();
      return score;
    });
  }

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

  public async getTokenCreator() {
    const signature = await this.getTokenCreaetionSignature();

    const transaction = await this.connection.getParsedTransaction(signature, {
      maxSupportedTransactionVersion: 0,
    });

    if (!transaction) throw new Error("Failed to get transaction");

    const creator =
      transaction.transaction.message.accountKeys[0].pubkey.toBase58();

    return { signature, creator };
  }

  public async getCreatorInfo(totalSupply: number) {
    const { signature, creator } = await this.getTokenCreator();

    const tokenInfo = await this.connection.getTokenAccountsByOwner(
      new PublicKey(creator),
      {
        mint: this.address,
      }
    );

    if (!tokenInfo) throw new Error("Failed to get creator balance");

    const parsed = parseTokenAccountData(tokenInfo.value[0].account.data);

    if (!parsed) throw new Error("Failed to parse creator balance");

    const balance = parseFloat(parsed.amount.toString().slice(0, -6));
    const percentage = (balance / totalSupply) * 100;
    return {
      address: creator,
      signature: signature,
      mint: this.address.toBase58(),
      token: tokenInfo.value[0].pubkey.toBase58(),
      balance,
      percentage,
    };
  }

  public async getTokenCreaetionSignature() {
    const addressChecker = new AddressChecker();

    const pda = await addressChecker.getMetaplexPda(this.address.toBase58());

    if (!pda) throw new Error("Failed to get pda");
    const signatures = await this.connection.getSignaturesForAddress(pda, {});

    if (!signatures || signatures.length === 0 || !signatures[0]) {
      throw new Error("No signatures found");
    }

    return signatures[signatures.length - 1].signature;
  }

  public async getLecagyCreator() {
    const signature = await this.getTokenCreaetionSignature();

    const transaction = await this.connection.getParsedTransaction(signature, {
      maxSupportedTransactionVersion: 0,
    });

    if (!transaction) throw new Error("Failed to get transaction");

    const creator =
      transaction.transaction.message.accountKeys[0].pubkey.toBase58();

    return creator;
  }

  public async getTopHolders(range = 10) {
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

  public async getHolderData(totalSupply: number, slice: number = 10) {
    const holders = await this.getTopHolders(slice);

    const dexSupplys: DexSupplyShape[] = [];
    const top10Supplys: TopHolderSupplyShape[] = [];

    await Promise.all(
      holders.map(async (holder, index) => {
        const account = await this.connection.getParsedAccountInfo(
          holder.address
        );
        const address = (account.value?.data as ParsedAccountData)?.parsed?.info
          ?.owner;

        const isDexAddress = new AddressChecker().isDexAddress(address);
        if (holder.uiAmount && address && !isDexAddress.isDex) {
          top10Supplys.push({
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
      })
    );

    const dexPercentage =
      (dexSupplys.reduce((acc, cur) => acc + cur.amount, 0) / totalSupply) *
      100;
    const top10HolderPercentage =
      (top10Supplys.reduce((acc, cur) => acc + cur.amount, 0) / totalSupply) *
      100;
    const top20HolderPercentage =
      (top10Supplys.reduce((acc, cur) => acc + cur.amount, 0) / totalSupply) *
      100;
    const top50HolderPercentage =
      (top10Supplys.reduce((acc, cur) => acc + cur.amount, 0) / totalSupply) *
      100;

    return {
      dexPercentage,
      top10: {
        percentage: top10HolderPercentage,
        holders: top10Supplys,
      },
      dexSupplys,
    };
  }

  public async getTopHolderValidation({
    holders,
  }: {
    holders: { address: string }[];
  }) {
    const holderTokenData = [];

    for (const holder of holders) {
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

  public async getHolderCount() {
    try {
      const helius = new HeliusModule();
      const total = [];
      let cursor: string | null | undefined = undefined;
      while (cursor !== null) {
        const holderData = await helius.getAllHolders(
          this.address.toBase58(),
          cursor
        );
        total.push(...holderData.result.token_accounts);
        cursor =
          "cursor" in holderData.result ? holderData.result.cursor : null;
      }

      return {
        count: total.length,
        holders: total,
      };
    } catch (error) {
      console.log(error);
      logger.error("Failed to get holder count", error);
      throw new Error("Failed to get holder count");
    }
  }
}
