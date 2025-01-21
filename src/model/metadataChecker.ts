import { BaseChecker } from "@/src/model/baseChecker";
import { Connection, PublicKey } from "@solana/web3.js";
import { AddressChecker } from "@/src/module/addressChecker";
import { getMint } from "@solana/spl-token";
import { PUMPFUN_MINT_AUTHORITY } from "@/src/constant/address";
import { parseTokenAccountData } from "@/src/lib/parseAccount";

interface IMetadataChecker {}

/**
 * MetadataChecker
 * @implements {IMetadataChecker}
 * @description This class is responsible for checking the metadata of a project.
 * It should check the name, symbol, description, mutability, mintability, freezability and total supply of the project.
 */

export class MetadataChecker extends BaseChecker implements IMetadataChecker {
  address: PublicKey;
  connection: Connection;

  constructor(address: string, connection: Connection) {
    super();
    this.address = new PublicKey(address);
    this.connection = connection;
  }

  public async check() {}

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

    return { signature, creator };
  }

  public async getCreatorInfo() {
    const { signature, creator } = await this.getTokenCreator();

    const balance = await this.connection.getTokenAccountsByOwner(
      new PublicKey(creator),
      {
        mint: this.address,
      }
    );

    if (!balance) throw new Error("Failed to get creator balance");

    const parsed = parseTokenAccountData(balance.value[0].account.data);

    if (!parsed) throw new Error("Failed to parse creator balance");

    return {
      address: creator,
      signature: signature,
      mint: this.address.toBase58(),
      token: balance.value[0].pubkey.toBase58(),
      balance: parseFloat(parsed.amount.toString().slice(0, -6)),
    };
  }

  public async getBaseMetadata() {
    try {
      const metadata = await new AddressChecker(
        this.address.toBase58()
      ).getTokenMetadata();
      const mintInfo = await getMint(
        this.connection,
        new PublicKey(this.address)
      );

      if (!metadata || !mintInfo) throw new Error("Failed to get metadata");
      return {
        name: metadata.name,
        symbol: metadata.symbol,
        address: this.address,
        primarySold: metadata.primarySaleHappened,
        initialized: mintInfo.isInitialized,
        mutability: metadata.isMutable,
        mintability: mintInfo.mintAuthority === null ? false : true,
        freezability: mintInfo.freezeAuthority === null ? false : true,
        pumpfun: metadata.updateAuthority === PUMPFUN_MINT_AUTHORITY,
      };
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get metadata");
    }
  }
}
