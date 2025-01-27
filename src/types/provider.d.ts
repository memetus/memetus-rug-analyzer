import {
  CashtagEntity,
  HashtagEntity,
  MentionEntity,
} from "twitter-api-v2/dist/esm/types/entities.types";
import { DataChangeShpae, MarketData, Txn, Volume } from "@/src/types/market";
import { LiquidityLockedInfo, LPInfo } from "@/src/types/liquidity";
import { DexScreenerResponseShape } from "@/src/types/dex";
import { BaseGrowth } from "@/src/data/baseGrowth";
import { UrlPair, WebsiteShape } from "@/src/types/website";
import { GithubShape } from "@/src/types/githubShape";

export type ProviderCreatorInfoShape = {
  address: string;
  tokenAccount: string;
  balance: string;
  percentage: number;
  lock: {
    isLocked: boolean;
    lockedAmount: number;
  };
  sold: {
    isSold: boolean;
    soldAmount: number;
  };
  createSignature: string;
  isFishingAccount: boolean;
};

export type ProviderMetadataShape = {
  name: string;
  symbol: string;
  address: string;
  totalSupply: number;
  mutability: boolean;
  mintability: boolean;
  freezability: boolean;
  pumpfun: boolean;
  metaplexPda: string;
};

export class ProviderCommunityShape {
  isTwitterExist: boolean;
  isTelegramExist: boolean;
  isDiscordExist: boolean;
  isTwitterVerified: boolean | undefined;
  twitterFollowers: number;
  tweetCount: number;
  mediaCount: number;
  twitterLastUpdated: string | undefined;
  createTwitterAccountAt: string | undefined;
}

export type ProviderHolderShape = {
  totalHolder: number;
  topHolders: {
    percentage: number;
    address: string;
    balance: number;
    validation: boolean;
  };
};

export type ProviderMarketShape = MarketData;

export type ProviderLiquidityShape = {
  address: string;
  totalLiquidity: number;
  totalLpCount: number;
  totalLockedLiquidity: number;
  totalLockedLiquidityPercentage: number;
  lpLockedInfoList: (LiquidityLockedInfo | undefined)[];
  lpList: (LPInfo | undefined)[];
  largestLp: LPInfo | undefined;
};

export type CheckData = {
  creatorAddress: string;
  creatorTokenAddress: string;
  creatorBalance: number;
  creatorPercentage: number;
  creatorLock: {
    isLocked: boolean;
    lockAmount: string;
  };
  creatorSignature: string;
  isCreatorFishingAccount: boolean;
  tokenName: string;
  tokenSymbol: string;
  address: string;
  totalSupply: number;
  initialized: boolean;
  mutability: boolean;
  mintability: boolean;
  freezability: boolean;
  pumpfun: boolean;
  metadataPda: string;
  isTwitterExist: boolean;
  isTelegramExist: boolean;
  isDiscordExist: boolean;
  isTwitterVerified: boolean;
  twitterFollowers: number;
  tweetCount: number;
  mediaCount: number;
  twitterHashTags: HashtagEntity[];
  twitterCashTags: CashtagEntity[];
  twitterMentions: MentionEntity[];
  twitterLastUpdated: string | undefined;
  createTwitterAccountAt: string | undefined;
  totalHolder: number;
  topHolders: {
    percentage: number;
    address: string;
    balance: number;
  }[];
  top10Validation: {
    address: string;
    validation: boolean;
  }[];
  totalLiquidity: number = 0;
  totalLpCount: number;
  totalLockedLiquidity: number = 0;
  totalLockedLiquidityPercentage: number = 0;
  lpLockedInfoList: (LiquidityLockedInfo | undefined)[];
  lpList: (LPInfo | undefined)[];
  largestLp: DexScreenerResponseShape | undefined;
  priceNative: number = 0;
  priceUsd: number = 0;
  m5Txns: Txn;
  h1Txns: Txn;
  h6Txns: Txn;
  h24Txns: Txn;
  volume: Volume;
  volumeChange: DataChangeShpae;
  priceChange: DataChangeShpae;
  marketCap: number = 0;
  fdv: number = 0;
  marketGrowth: BaseGrowth;
  urls: UrlPair[] = [];
  creatorTransfer: {
    type: "send" | "receive";
    from: string;
    to: string;
    amount: number;
  }[] = [];
  creatorSellCount: number = 0;
  githubShape: GithubShape[] = [];
  websiteShape: WebsiteShape[] = [];
};
