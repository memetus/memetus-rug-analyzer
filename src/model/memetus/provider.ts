import { createConnection, createUmiEndpoint } from "@/src/config/chain";
import { BaseCommunity } from "@/src/data/baseCommunity";
import { parseTwitterHandle } from "@/src/lib/parseTwitterHandle";
import { AddressChecker } from "@/src/module/addressChecker";
import { DexScreenerGetter } from "@/src/module/dexScreenerGetter";
import { DiscordChecker } from "@/src/module/discordChecker";
import { HeliusModule } from "@/src/module/heliusModule";
import { TelegramChecker } from "@/src/module/telegramChecker";
import { TransactionChecker } from "@/src/module/transactionChecker";
import { TwitterChecker } from "@/src/module/twitterChecker";
import { UrlChecker } from "@/src/module/urlChecker";
import { DexScreenerResponseShape } from "@/src/types/dex";
import { UrlPair, WebsiteShape } from "@/src/types/website";
import { Connection, ParsedAccountData, PublicKey } from "@solana/web3.js";
import { LiquidityLockedInfo, LPInfo } from "@/src/types/liquidity";
import {
  CashtagEntity,
  HashtagEntity,
  MentionEntity,
} from "twitter-api-v2/dist/esm/types/entities.types";
import { LIQUIDITY_STATE_LAYOUT_V4 } from "@raydium-io/raydium-sdk";
import { DataChangeShpae, Txn, Volume } from "@/src/types/market";
import { BaseGrowth } from "@/src/data/baseGrowth";
import { getMint } from "@solana/spl-token";
import { fetchMetadataFromSeeds } from "@metaplex-foundation/mpl-token-metadata";
import {
  PUMPFUN_MINT_AUTHORITY,
  TIMELOCK_ADDRESS,
} from "@/src/constant/address";
import { parseTokenAccountData } from "@/src/lib/parseAccount";
import { LockCheckerShape } from "@/src/types/lock";
import { GithubShape } from "@/src/types/githubShape";
import { GithubChecker } from "@/src/module/githubChecker";
import { RED } from "@/src/cli";

interface IDataProvider {}

/**
 * DataProvider
 * @implements {IDataProvider}
 * @description This class is responsible for providing data for the checker module;
 * Every checker module require different data to check the project.
 * DataProvider class is gatter all the data and provide it to the checker module what they need.
 */

/**
 * If you want to run signle checker module then you don't need to use this class.
 * This class is only for the MemetusRugChecker class to run all the checker module at once.
 */

export class DataProvider implements IDataProvider {
  address: string;

  // utility module
  connection: Connection;
  umiClient: ReturnType<typeof createUmiEndpoint>;
  heliusClient: HeliusModule;
  addressModule: AddressChecker;
  dexScreenerModule: DexScreenerGetter;
  transactionModule: TransactionChecker;
  githubModule: GithubChecker;
  urlModule: UrlChecker;

  // checker module

  // data
  creatorAddress!: string;
  creatorTokenAddress!: string;
  creatorBalance!: number;
  creatorPercentage!: number;
  creatorLock!: {
    isLocked: boolean;
    lockAmount: string;
  };
  creatorSignature!: string;
  isCreatorFishingAccount!: boolean;
  tokenName!: string;
  tokenSymbol!: string;
  tokenAddress!: string;
  totalSupply!: number;
  initialized!: boolean;
  mutability!: boolean;
  mintability!: boolean;
  freezability!: boolean;
  pumpfun!: boolean;
  metadataPda!: string;
  isTwitterExist!: boolean;
  isTelegramExist!: boolean;
  isDiscordExist!: boolean;
  isTwitterVerified!: boolean;
  twitterFollowers!: number;
  tweetCount!: number;
  mediaCount!: number;
  twitterHashTags!: HashtagEntity[];
  twitterCashTags!: CashtagEntity[];
  twitterMentions!: MentionEntity[];
  twitterLastUpdated: string | undefined;
  createTwitterAccountAt!: string | undefined;
  totalHolder!: number;
  topHolders!: {
    percentage: number;
    address: string;
    balance: number;
  }[];
  top10Validation!: {
    address: string;
    validation: boolean;
  }[];
  totalLiquidity: number = 0;
  totalLpCount!: number;
  totalLockedLiquidity: number = 0;
  totalLockedLiquidityPercentage: number = 0;
  lpLockedInfoList!: (LiquidityLockedInfo | undefined)[];
  lpList!: (LPInfo | undefined)[];
  largestLp!: DexScreenerResponseShape | undefined;
  priceNative: number = 0;
  priceUsd: number = 0;
  m5Txns!: Txn;
  h1Txns!: Txn;
  h6Txns!: Txn;
  h24Txns!: Txn;
  volume!: Volume;
  volumeChange!: DataChangeShpae;
  priceChange!: DataChangeShpae;
  marketCap: number = 0;
  fdv: number = 0;
  marketGrowth!: BaseGrowth;
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

  constructor(address: string) {
    this.address = address;
    this.connection = createConnection();
    this.umiClient = createUmiEndpoint();
    this.githubModule = new GithubChecker();
    this.heliusClient = new HeliusModule();
    this.addressModule = new AddressChecker();
    this.dexScreenerModule = new DexScreenerGetter();
    this.transactionModule = new TransactionChecker();
    this.urlModule = new UrlChecker();
  }
  public async setData() {
    const baseData: DexScreenerResponseShape[] =
      await this.dexScreenerModule.getTokenSearchAddress(this.address);
    await this.setOnchainData(baseData);
    await this.setSocialData(baseData);

    const uniqueUrls = new Map<string, UrlPair>();

    for (const item of this.urls) {
      if (!uniqueUrls.has(item.url)) {
        uniqueUrls.set(item.url, item);
      }
    }

    this.urls = Array.from(uniqueUrls.values());

    return this.getData();
  }

  public async setOnchainData(data: DexScreenerResponseShape[]) {
    const { uiAmount: supply } = (
      await this.connection.getTokenSupply(new PublicKey(this.address))
    ).value;

    if (supply) {
      this.totalSupply = supply;
    }

    const total = [];
    let cursor: string | null | undefined = undefined;
    while (cursor !== null) {
      const holderData = await this.heliusClient.getAllHolders(
        this.address,
        cursor
      );
      total.push(...holderData.result.token_accounts);
      cursor = "cursor" in holderData.result ? holderData.result.cursor : null;
    }

    this.totalHolder = total.length;
    const sorted = total
      .sort((a, b) => {
        return b.amount - a.amount;
      })
      .slice(0, 50);

    if (supply) {
      const holdersInfo = await Promise.all(
        sorted.map(async (holder) => {
          if (this.addressModule.isDexAddress(holder.owner).isDex) {
            return null;
          }
          return {
            percentage: (holder.amount / supply) * 100,
            address: holder.owner as string,
            balance: holder.amount as number,
          };
        })
      );

      this.topHolders = holdersInfo.filter((v) => v && v) as {
        percentage: number;
        address: string;
        balance: number;
      }[];

      this.top10Validation = await Promise.all(
        sorted.slice(0, 10).map(async (holder) => {
          const validation = await this.heliusClient.getAllTokens({
            address: holder.owner,
            limit: 10,
          });

          return {
            address: holder.owner,
            validation: validation.result.total > 1 ? true : false,
          };
        })
      );
    }

    const sortedDex = data.sort((a, b) => {
      if (
        a.liquidity &&
        b.liquidity &&
        "usd" in a.liquidity &&
        "usd" in b.liquidity
      ) {
        return b.liquidity.usd - a.liquidity.usd;
      }
      return 0;
    });

    this.totalLpCount = data.length;

    const lpList = sortedDex.map((dex) => {
      if (dex.liquidity && "usd" in dex.liquidity) {
        this.totalLiquidity += dex.liquidity.usd;
        return {
          name: dex.dexId,
          pair: dex.pairAddress,
          liquidity: dex.liquidity?.usd ? dex.liquidity.usd : 0,
          lpPercentage: (dex.liquidity.usd / this.totalLiquidity) * 100,
        };
      }
      return null;
    });

    this.lpList = lpList.filter((v) => v && v) as LPInfo[];

    const lockedInfo = await Promise.all(
      sortedDex.slice(0, 5).map(async (dex) => {
        if (dex.dexId === "raydium") {
          const acc = await this.connection.getMultipleAccountsInfo([
            new PublicKey(dex.pairAddress),
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
                pair: dex.pairAddress,
              };
            }
            const mintInfo = (accInfo?.value?.data as ParsedAccountData).parsed
              ?.info;

            lpReserve = lpReserve / Math.pow(10, mintInfo?.decimals);
            const supply = mintInfo?.supply / Math.pow(10, mintInfo?.decimals);
            const burnAmt = lpReserve - supply;
            const burnPct = (burnAmt / lpReserve) * 100;

            return {
              supply: supply,
              burnAmount: burnAmt,
              burnPercentage: burnPct,
              isLocked: burnPct >= 90 ? true : false,
              pair: dex.pairAddress,
            };
          }
        }
      })
    );

    this.lpLockedInfoList = lockedInfo.filter(
      (v) => v && !Number.isNaN(v.supply) && v
    );

    this.lpLockedInfoList.forEach((info) => {
      if (info) {
        this.totalLockedLiquidity += info.burnAmount;
        this.totalLockedLiquidityPercentage += info.burnPercentage;
      }
    });

    this.largestLp = sortedDex[0];

    const { volume } = this.largestLp;

    function calculateGrowthRate(
      current: number,
      previous: number
    ): number | null {
      if (previous === 0) {
        return null;
      }
      return (current / previous) * 100;
    }

    this.volumeChange = {
      h24: calculateGrowthRate(volume.h6, volume.h24) ?? 0,
      h6: calculateGrowthRate(volume.h1, volume.h6) ?? 0,
      h1: calculateGrowthRate(volume.m5, volume.h1) ?? 0,
    };
    this.priceNative = parseFloat(this.largestLp.priceNative);
    this.priceUsd = parseInt(this.largestLp.priceUsd);
    this.m5Txns = this.largestLp.txns.m5;
    this.h1Txns = this.largestLp.txns.h1;
    this.h6Txns = this.largestLp.txns.h6;
    this.h24Txns = this.largestLp.txns.h24;
    this.volume = volume;
    this.priceChange = this.largestLp.priceChange;
    this.marketCap = this.largestLp.marketCap;
    this.fdv = this.largestLp.fdv;
    this.marketGrowth = new BaseGrowth();

    if (this.volumeChange.h24 && this.priceChange.h24) {
      this.marketGrowth.h24 = {
        volume: this.volumeChange.h24,
        price: this.priceChange.h24,
        gap: this.volumeChange.h24 - this.priceChange.h24,
        faster:
          this.volumeChange.h24 > this.priceChange.h24 ? "volume" : "price",
      };
    }
    if (this.volumeChange.h6 && this.priceChange.h6) {
      this.marketGrowth.h6 = {
        volume: this.volumeChange.h6,
        price: this.priceChange.h6,
        gap: this.volumeChange.h6 - this.priceChange.h6,
        faster: this.volumeChange.h6 > this.priceChange.h6 ? "volume" : "price",
      };
    }
    if (this.volumeChange.h1 && this.priceChange.h1) {
      this.marketGrowth.h1 = {
        volume: this.volumeChange.h1,
        price: this.priceChange.h1,
        gap: this.volumeChange.h1 - this.priceChange.h1,
        faster: this.volumeChange.h1 > this.priceChange.h1 ? "volume" : "price",
      };
    }

    const mintInfo = await getMint(
      this.connection,
      new PublicKey(this.address)
    );

    const metadata = await fetchMetadataFromSeeds(this.umiClient as any, {
      mint: new PublicKey(this.address) as any,
    });

    if (metadata) {
      this.tokenName = metadata.name;
      this.tokenSymbol = metadata.symbol;
      this.mutability = metadata.isMutable;
      this.pumpfun = metadata.updateAuthority === PUMPFUN_MINT_AUTHORITY;
    }

    if (mintInfo) {
      this.initialized = mintInfo.isInitialized;
      this.mintability = mintInfo.mintAuthority === null ? false : true;
      this.freezability = mintInfo.freezeAuthority === null ? false : true;
    }

    const pda = await this.addressModule.getMetaplexPda(this.address);
    if (pda) {
      const signatures = await this.connection.getSignaturesForAddress(pda, {});
      this.metadataPda = pda.toBase58();
      if (signatures.length > 0) {
        this.creatorSignature = signatures[signatures.length - 1].signature;
        const transaction = await this.connection.getParsedTransaction(
          this.creatorSignature,
          {
            maxSupportedTransactionVersion: 0,
          }
        );
        if (transaction) {
          this.creatorAddress =
            transaction.transaction.message.accountKeys[0].pubkey.toBase58();
        }
      }
    }

    if (this.creatorAddress) {
      const tokenInfo = await this.connection.getTokenAccountsByOwner(
        new PublicKey(this.creatorAddress),
        {
          mint: new PublicKey(this.address),
        }
      );

      if (tokenInfo) {
        const parsed = parseTokenAccountData(tokenInfo.value[0].account.data);
        if (parsed.amount === 1n || parsed.amount === 0n) {
          this.creatorBalance = 0;
          this.creatorPercentage = 0;
        } else {
          this.creatorBalance = parseFloat(
            parsed.amount.toString().slice(0, -6)
          );
          this.creatorPercentage =
            (this.creatorBalance / this.totalSupply) * 100;
        }
        this.creatorTokenAddress = tokenInfo.value[0].pubkey.toBase58();
      }
    }

    if (this.creatorSignature && this.creatorTokenAddress) {
      const signatures = await this.connection.getSignaturesForAddress(
        new PublicKey(this.creatorTokenAddress),
        {
          until: this.creatorSignature,
        }
      );

      if (signatures && signatures.length > 0) {
        const sigs = signatures.map((sig) => sig.signature);
        const txDetails = await this.connection.getParsedTransactions(sigs, {
          maxSupportedTransactionVersion: 0,
          commitment: "confirmed",
        });
        const checker: LockCheckerShape = {
          programId: [],
          token: null,
          amount: 0,
        };

        for (const tx of txDetails) {
          if (tx && tx.transaction.message.instructions) {
            for (const instruction of tx.transaction.message.instructions) {
              if (
                instruction.programId.toBase58() === TIMELOCK_ADDRESS.STREAMFLOW
              ) {
                checker.programId.push(instruction.programId.toBase58());
                checker.token =
                  tx.transaction.message.accountKeys[3].pubkey.toBase58();
                const balance = await this.connection.getTokenAccountsByOwner(
                  new PublicKey(checker.token),
                  {
                    mint: new PublicKey(this.address),
                  }
                );

                if (balance && balance.value.length > 0) {
                  const parsed = parseTokenAccountData(
                    balance.value[0].account.data
                  );
                  checker.amount += parseFloat(
                    parsed.amount.toString().slice(0, -6)
                  );
                }
              }
            }
          }

          if (tx?.meta?.logMessages?.toString().includes("Sell")) {
            this.creatorSellCount += 1;
          }

          if (tx?.meta?.logMessages?.toString().includes("TransferChecked")) {
            const ins = tx.transaction.message.instructions;
            for (const item of ins) {
              if (
                "parsed" in item &&
                item.parsed &&
                item.parsed.type === "transferChecked"
              ) {
                const { destination, source, tokenAmount } = item.parsed.info;
                const amount = tokenAmount.uiAmount;
                if (destination.toString() === this.creatorTokenAddress) {
                  const account = await this.connection.getParsedAccountInfo(
                    new PublicKey(source)
                  );

                  // @ts-ignore
                  const owner = account.value?.data?.parsed?.info.owner;
                  if (owner) {
                    this.creatorTransfer.push({
                      type: "receive",
                      from: owner,
                      to: this.creatorAddress,
                      amount,
                    });
                  }
                } else if (source.toString() === this.creatorTokenAddress) {
                  const account = await this.connection.getParsedAccountInfo(
                    new PublicKey(destination)
                  );

                  // @ts-ignore
                  const owner = account.value?.data?.parsed?.info.owner;
                  if (owner) {
                    this.creatorTransfer.push({
                      type: "send",
                      from: this.creatorAddress,
                      to: owner,
                      amount,
                    });
                  }
                }
              }
            }
          } else if (tx?.meta?.logMessages?.toString().includes("Transfer")) {
            const ins = tx.transaction.message.instructions;
            for (const item of ins) {
              if (
                "parsed" in item &&
                item.parsed &&
                item.parsed.type == "transfer"
              ) {
                const { destination, source, tokenAmount } = item.parsed.info;
                const amount = tokenAmount?.uiAmount ?? 0;
                if (destination.toString() === this.creatorTokenAddress) {
                  const account = await this.connection.getParsedAccountInfo(
                    new PublicKey(source)
                  );
                  // @ts-ignore
                  const owner = account.value?.data?.parsed?.info.owner;
                  if (owner) {
                    this.creatorTransfer.push({
                      type: "receive",
                      from: owner,
                      to: this.creatorAddress,
                      amount,
                    });
                  }
                } else if (source.toString() === this.creatorTokenAddress) {
                  const account = await this.connection.getParsedAccountInfo(
                    new PublicKey(destination)
                  );
                  // @ts-ignore
                  const owner = account.value?.data?.parsed?.info.owner;
                  if (owner) {
                    this.creatorTransfer.push({
                      type: "send",
                      from: this.creatorAddress,
                      to: owner,
                      amount,
                    });
                  }
                }
              }
            }
          }
        }
        this.creatorLock = {
          isLocked: checker.token ? true : false,
          lockAmount: checker.amount.toString(),
        };
      }
    }

    const urls = data[0].info.websites as UrlPair[];
    this.urls = [...this.urls, ...urls];

    for (const url of urls) {
      if (url.label === "Github") {
        const githubData = await this.githubModule.getEvaluationData(url.url);
        if (githubData) {
          this.githubShape.push({
            ...githubData,
          });
        } else {
          console.log(
            `${RED}Caution! The registered Github repository cannot be accessed. While it does not affect the score, it is likely a rug pull\n`
          );
        }
      } else {
        const urlInfo = await this.urlModule.getUrlInfo(url.url);
        const urlMetadata = await this.urlModule.getUrlMetadata(url.url);
        if (urlMetadata && urlInfo) {
          this.websiteShape.push({
            ...url,
            ...urlInfo,
            ...urlMetadata,
          });
        } else {
          console.log(
            `${RED}Caution! The registered URL cannot be accessed. While it does not affect the score, it is likely a rug pull\n`
          );
        }
      }
    }
  }

  public async setSocialData(data: DexScreenerResponseShape[]) {
    const baseData = data.find(
      (d) => d && d.info && "socials" in d.info && d.info.socials
    );
    if (baseData) {
      const baseCommunity = new BaseCommunity();
      for (const social of baseData.info.socials) {
        if (social.type === "twitter") {
          baseCommunity.twitter.checker = new TwitterChecker();
          baseCommunity.twitter.handle = parseTwitterHandle(social.url);
        } else if (social.type === "telegram") {
          baseCommunity.telegram.checker = new TelegramChecker();
          baseCommunity.telegram.handle = social.url;
        } else if (social.type === "discord") {
          baseCommunity.discord.checker = new DiscordChecker();
          baseCommunity.telegram.handle = social.url;
        }
      }
      if (baseCommunity.twitter.checker && baseCommunity.twitter.handle) {
        const twitterData = await baseCommunity.twitter.checker.searchUsername(
          baseCommunity.twitter.handle
        );
        if (twitterData) {
          this.isTwitterExist = true;
          this.isTwitterVerified = twitterData.verified ? true : false;
          this.twitterFollowers =
            twitterData.public_metrics?.followers_count || 0;
          this.tweetCount = twitterData.public_metrics?.tweet_count || 0;
          this.mediaCount = twitterData.public_metrics?.media_count || 0;
          this.twitterHashTags =
            twitterData.entities?.description?.hashtags || [];
          this.twitterCashTags =
            twitterData.entities?.description?.cashtags || [];
          this.twitterMentions =
            twitterData.entities?.description?.mentions || [];
          if (twitterData.entities?.url?.urls) {
            const urls = twitterData.entities?.url?.urls
              .map((url) => {
                const label = this.urlModule.getUrlType(url.url);
                if (label) {
                  return {
                    label: label,
                    url: url.url,
                  };
                }
                return null;
              })
              .filter((v) => v && v) as UrlPair[];

            this.urls = [...this.urls, ...urls];
          }

          if (twitterData.url) {
            const label = this.urlModule.getUrlType(twitterData.url);
            if (label) {
              this.urls = [
                ...this.urls,
                {
                  label: label,
                  url: twitterData.url,
                },
              ];
            }
          }
          this.createTwitterAccountAt = twitterData.created_at;
          if (twitterData.most_recent_tweet_id) {
            const lastTweetInfo = await baseCommunity.twitter.checker.getTweet(
              twitterData.most_recent_tweet_id
            );
            if (lastTweetInfo) {
              this.twitterLastUpdated = lastTweetInfo.created_at ?? undefined;
            }
          }
        } else {
          console.log(
            `${RED}Caution! The registered Twitter account cannot be accessed. While it does not affect the score, it is likely a rug pull\n`
          );
          this.isTwitterExist = false;
        }
        this.isTelegramExist = baseCommunity.telegram.checker ? true : false;
        this.isDiscordExist = baseCommunity.discord.checker ? true : false;
      }
    }
  }

  public getData() {
    return {
      address: this.address,
      creatorAddress: this.creatorAddress,
      creatorTokenAddress: this.creatorTokenAddress,
      creatorBalance: this.creatorBalance,
      creatorPercentage: this.creatorPercentage,
      creatorLock: this.creatorLock,
      creatorSignature: this.creatorSignature,
      isCreatorFishingAccount: this.isCreatorFishingAccount,
      tokenName: this.tokenName,
      tokenSymbol: this.tokenSymbol,
      totalSupply: this.totalSupply,
      initialized: this.initialized,
      mutability: this.mutability,
      mintability: this.mintability,
      freezability: this.freezability,
      pumpfun: this.pumpfun,
      metadataPda: this.metadataPda,
      isTwitterExist: this.isTwitterExist,
      isTelegramExist: this.isTelegramExist,
      isDiscordExist: this.isDiscordExist,
      isTwitterVerified: this.isTwitterVerified,
      twitterFollowers: this.twitterFollowers,
      tweetCount: this.tweetCount,
      mediaCount: this.mediaCount,
      twitterHashTags: this.twitterHashTags,
      twitterCashTags: this.twitterCashTags,
      twitterMentions: this.twitterMentions,
      twitterLastUpdated: this.twitterLastUpdated,
      createTwitterAccountAt: this.createTwitterAccountAt,
      totalHolder: this.totalHolder,
      topHolders: this.topHolders,
      top10Validation: this.top10Validation,
      totalLiquidity: this.totalLiquidity,
      totalLpCount: this.totalLpCount,
      totalLockedLiquidity: this.totalLockedLiquidity,
      totalLockedLiquidityPercentage: this.totalLockedLiquidityPercentage,
      lpLockedInfoList: this.lpLockedInfoList,
      lpList: this.lpList,
      largestLp: this.largestLp,
      priceNative: this.priceNative,
      priceUsd: this.priceUsd,
      m5Txns: this.m5Txns,
      h1Txns: this.h1Txns,
      h6Txns: this.h6Txns,
      h24Txns: this.h24Txns,
      volume: this.volume,
      volumeChange: this.volumeChange,
      priceChange: this.priceChange,
      marketCap: this.marketCap,
      fdv: this.fdv,
      marketGrowth: this.marketGrowth,
      urls: this.urls,
      creatorTransfer: this.creatorTransfer,
      creatorSellCount: this.creatorSellCount,
      githubShape: this.githubShape,
      websiteShape: this.websiteShape,
    };
  }
}
