import { Connection } from "@solana/web3.js";
import { CommunityChecker } from "@/src/model/communityChecker";
import { HolderChecker } from "@/src/model/holderChecker";
import { LiquidityChecker } from "@/src/model/liquidityChecker";
import { MarketChecker } from "@/src/model/marketChecker";
import { MetadataChecker } from "@/src/model/metadataChecker";
import { ReferenceChecker } from "@/src/model/referenceChecker";
import { WebsiteChecker } from "@/src/model/websiteChecker";

interface IMemetusRugChecker {}

/**
 * MemetusRugChecker
 * @implements {IMemetusRugChecker}
 * @description This class is responsible for aggregate all checker in single module.
 * It should contain communityChecker, holderChecker, liquidityChecker, marketChecker, metadataChecker, referenceChecker, websiteChecker.
 */

export class MemetusRugChecker implements IMemetusRugChecker {
  target: string; // target address
  connectin: Connection;
  communityChecker: CommunityChecker;
  holderChecker: HolderChecker;
  liquidityChecker: LiquidityChecker;
  marketChecker: MarketChecker;
  metadataChecker: MetadataChecker;
  referenceChecker: ReferenceChecker;
  websiteChecker: WebsiteChecker;

  constructor(target: string, connection: Connection) {
    this.target = target;
    this.connectin = connection;

    this.communityChecker = new CommunityChecker(target);
    this.holderChecker = new HolderChecker(target, connection);
    this.liquidityChecker = new LiquidityChecker(target, connection);
    this.marketChecker = new MarketChecker(target, connection);
    this.metadataChecker = new MetadataChecker(target, connection);
    this.referenceChecker = new ReferenceChecker(target);
    this.websiteChecker = new WebsiteChecker(target);
  }

  public async check() {
    await this.communityChecker.check();
    await this.holderChecker.check();
    await this.liquidityChecker.check();
    // await this.marketChecker.check();
    await this.metadataChecker.check();
    // await this.referenceChecker.check();
    await this.websiteChecker.check();
  }
}
