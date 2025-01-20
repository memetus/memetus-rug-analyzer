import { BaseChecker } from "@/src/model/baseChecker";
import { Connection, PublicKey } from "@solana/web3.js";
import { AddressChecker } from "../module/addressChecker";
import { getMint } from "@solana/spl-token";

interface IMetadataChecker {}

/**
 * MetadataChecker
 * @implements {IMetadataChecker}
 * @description This class is responsible for checking the metadata of a project.
 * It should check the name, symbol, description, mutability, mintability, freezability and total supply of the project.
 */

export class MetadataChecker extends BaseChecker implements IMetadataChecker {
  address: string;
  connection: Connection;

  constructor(address: string, connection: Connection) {
    super();
    this.address = address;
    this.connection = connection;
  }

  public async check() {
    this.getBaseMetadata();
  }

  public async getBaseMetadata() {
    try {
      const metadata = await new AddressChecker(
        this.address
      ).getTokenMetadata();
      const mintInfo = await getMint(
        this.connection,
        new PublicKey(this.address)
      );

      if (!metadata || !mintInfo) throw new Error("Failed to get metadata");
      return {
        name: metadata.name,
        symbol: metadata.symbol,
        primarySold: metadata.primarySaleHappened,
        initialized: mintInfo.isInitialized,
        mutability: metadata.isMutable,
        mintability: mintInfo.mintAuthority === null ? false : true,
        freezability: mintInfo.freezeAuthority === null ? false : true,
      };
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get metadata");
    }
  }
}
