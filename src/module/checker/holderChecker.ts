import { CheckerResponse } from "@/src/types/checker/checker";
import {
  Connection,
  PublicKey,
  TokenAccountBalancePair,
  TokenAmount,
} from "@solana/web3.js";
import {
  getAccount,
  getAssociatedTokenAddress,
  getMint,
} from "@solana/spl-token";
import { HolderCheckData } from "@/src/types/checker/holderChecker";

export class HolderChecker {
  public score: number = 0;
  private readonly connection: Connection;
  private creator: PublicKey;
  private topHolderAmount: number = 0;
  private topHolderPercentage: number = 0;
  private topHolders: HolderCheckData[] = [];
  public tokenAddress: PublicKey;

  constructor({
    connection,
    tokenAddress,
    creator,
  }: {
    connection: Connection;
    tokenAddress: PublicKey;
    creator: PublicKey;
  }) {
    this.connection = connection;
    this.tokenAddress = tokenAddress;
    this.creator = creator;
  }

  async check(): Promise<CheckerResponse> {
    const mintAddress = new PublicKey(this.tokenAddress);

    const totalSupply = await this.connection.getTokenSupply(mintAddress);
    const largestHolders = await this.connection.getTokenLargestAccounts(
      mintAddress
    );

    if (!this.isHolderExist(largestHolders.value, totalSupply?.value)) {
      throw new Error("Can not found holders of this token");
    }

    if (totalSupply && totalSupply.value && totalSupply.value.uiAmount) {
      for (const holder of largestHolders.value) {
        const account = await this.connection.getParsedAccountInfo(
          holder.address
        );

        const address = account.value?.owner;

        console.log(address);

        if (holder.uiAmount && holder.uiAmount !== 0 && address) {
          if (address === this.creator) {
            // dex exception
          } else {
            this.topHolderAmount += holder.uiAmount;
            const data: HolderCheckData = {
              address,
              amount: holder.uiAmount,
              percentage: (holder.uiAmount / totalSupply.value.uiAmount) * 100,
            };
            this.topHolders.push(data);
          }
        }
      }

      this.getCreatorScore(totalSupply.value.uiAmount);
      this.getTopHolderScore();
    }

    console.log("score", this.score);

    return { score: this.score };
  }

  private isHolderExist(
    largestHolders: TokenAccountBalancePair[],
    tokenSupply?: TokenAmount
  ) {
    if (
      largestHolders.length === 0 ||
      !tokenSupply ||
      tokenSupply.uiAmount === 0
    ) {
      return false;
    }

    return true;
  }

  public getMintInfo(address: PublicKey) {
    return getMint(this.connection, address);
  }

  private getTopHolderScore() {
    if (this.topHolderPercentage > 30) {
      this.score += 100;
    } else if (this.topHolderAmount > 25) {
      this.score += 50;
    } else if (this.topHolderAmount > 20) {
      this.score += 40;
    } else if (this.topHolderAmount > 15) {
      this.score += 30;
    } else if (this.topHolderAmount > 10) {
      this.score += 20;
    } else if (this.topHolderPercentage > 5) {
      this.score += 10;
    }
  }

  async getCreatorScore(totalSupply: number) {
    const tokenAccountAddress = await getAssociatedTokenAddress(
      this.tokenAddress,
      this.creator
    );
    const tokenAccount = await getAccount(this.connection, tokenAccountAddress);
    const tokenBalance = Number(tokenAccount.amount);
    const percentage = (tokenBalance / totalSupply) * 100;

    if (percentage < 10) {
      this.score += 10;
    } else if (percentage < 20) {
      this.score += 20;
    } else if (percentage < 30) {
      this.score += 30;
    } else if (percentage < 40) {
      this.score += 40;
    } else if (percentage < 50) {
      return null;
    }
  }

  async getTokenCreator(address: PublicKey) {
    const transactions = await this.connection.getSignaturesForAddress(
      address,
      {
        limit: 1,
      }
    );

    console.log(transactions);

    if (transactions.length === 0) {
      throw new Error("Can not found creator of this token");
    }

    const signature = transactions[0].signature;
    const transactionDetails = await this.connection.getTransaction(signature, {
      commitment: "confirmed",
    });
    if (!transactionDetails) {
      throw new Error("Can not found creator of this token");
    }
    const instructions = transactionDetails.transaction.message.instructions;
    for (const instruction of instructions) {
    }
  }
}
