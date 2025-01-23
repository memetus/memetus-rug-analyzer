import { BaseCheckResult } from "@/src/data/result/baseCheckResult";

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
  primarySold: boolean;
  mutability: boolean;
  mintbility: boolean;
  freezability: boolean;
  pumpfun: boolean;
  metaplexPda: string | undefined;
  creatorAddress: string | undefined;
  creatorBalance: number;
  isCreatorLocked: boolean;
  isCreatorSold: boolean;

  constructor() {
    const score = 0;
    super(score);
    this.name = undefined;
    this.symbol = undefined;
    this.primarySold = false;
    this.mutability = false;
    this.mintbility = false;
    this.freezability = false;
    this.pumpfun = false;
    this.metaplexPda = undefined;
    this.creatorAddress = undefined;
    this.creatorBalance = 0;
    this.isCreatorLocked = false;
    this.isCreatorSold = false;
  }
}
