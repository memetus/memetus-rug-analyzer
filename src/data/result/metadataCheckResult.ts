import { BaseCheckResult } from "@/src/data/result/baseCheckResult";
import { MetadataShape } from "@/src/types/metadata";

interface IMetadataCheckResult {}

/**
 * MetadataCheckResult
 * @implements {IMetadataCheckResult}
 * @description This class is responsible for checking the metadata of a project.
 * It should check if the project has a metadata.
 */

export class MetadataCheckResult
  extends BaseCheckResult
  implements IMetadataCheckResult
{
  name: string | undefined;
  symbol: string | undefined;
  mutability: boolean;
  mintbility: boolean;
  freezability: boolean;
  pumpfun: boolean;
  metaplexPda: string | undefined;
  creatorAddress: string | undefined;
  creatorBalance: number;
  isCreatorLocked: boolean;
  creatorTransfer: {
    type: "send" | "receive";
    from: string;
    to: string;
    amount: number;
  }[] = [];
  creatorSellCount: number = 0;

  constructor() {
    const score = 50;
    super(score);
    this.name = undefined;
    this.symbol = undefined;
    this.mutability = false;
    this.mintbility = false;
    this.freezability = false;
    this.pumpfun = false;
    this.metaplexPda = undefined;
    this.creatorAddress = undefined;
    this.creatorBalance = 0;
    this.isCreatorLocked = false;
  }

  public async setData({ data }: { data: MetadataShape }) {
    this.name = data.name;
    this.symbol = data.symbol;
    this.mutability = data.mutability;
    this.mintbility = data.mintbility;
    this.freezability = data.freezability;
    this.pumpfun = data.pumpfun;
    this.metaplexPda = data.metaplexPda;
    this.creatorAddress = data.creatorAddress;
    this.creatorBalance = data.creatorBalance;
    this.isCreatorLocked = data.isCreatorLocked;
  }

  public async getScore() {
    if (this.mutability) {
      this.score -= 10;
    } else {
      this.score += 10;
    }

    if (this.mintbility) {
      this.score -= 10;
    } else {
      this.score += 10;
    }

    if (this.freezability) {
      this.score += 10;
    } else {
      this.score += 10;
    }

    if (this.isCreatorLocked) {
      this.score += 20;
    }

    if (this.creatorTransfer.length > 0) {
      this.score -= 50;
    }
    if (this.creatorSellCount > 0) {
      this.score -= 50;
    }

    if (this.score >= 100) return 100;
    else if (this.score <= -100) return -100;
    return this.score;
  }
}
