import { BaseChecker } from "@/src/model/baseChecker";
import { Connection, ParsedTransaction, PublicKey } from "@solana/web3.js";
import { AddressChecker } from "@/src/module/addressChecker";
import { getMint } from "@solana/spl-token";
import {
  PUMPFUN_MINT_AUTHORITY,
  SYSTEM_PROGRAM_ID,
  TIMELOCK_ADDRESS,
} from "@/src/constant/address";
import { parseTokenAccountData } from "@/src/lib/parseAccount";
import { logger } from "@/src/config/log";
import { LockCheckerShape } from "@/src/types/lock";
import { TransactionChecker } from "@/src/module/transactionChecker";

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

  public async isCreatorLocked() {
    try {
      const { token, signature, address } = await this.getCreatorInfo();
      const signatures = await this.connection.getSignaturesForAddress(
        new PublicKey(token),
        {
          until: signature,
        }
      );

      console.log(signatures);

      if (!signatures || signatures.length === 0) {
        console.log("No signatures found");
        logger.error("No signatures found");
        throw new Error("No signatures found");
      }

      const sigs = signatures.map((sig) => sig.signature);
      const txDetails = await this.connection.getParsedTransactions(sigs, {
        maxSupportedTransactionVersion: 0,
      });

      for (const tx of txDetails) {
        if (tx && tx.transaction.message.instructions) {
          for (const instruction of tx.transaction.message.instructions) {
            if (
              instruction.programId.toBase58() === TIMELOCK_ADDRESS.STREAMFLOW
            ) {
              return this.isStreamFlowLock(address, tx.transaction);
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
      logger.error("Failed to check lock", error);
      throw new Error("Failed to check lock");
    }
  }

  public async getCreatorTransaction() {
    const { token, signature, address } = await this.getCreatorInfo();
    const signatures = await this.connection.getSignaturesForAddress(
      new PublicKey(token),
      {
        until: signature,
      }
    );

    console.log(address);
    console.log(token);
    console.log(signature);
    if (!signatures || signatures.length === 0) {
      console.log("No signatures found");
      logger.error("No signatures found");
      throw new Error("No signatures found");
    }

    const sigs = signatures.map((sig) => sig.signature);
    const txDetails = await this.connection.getParsedTransactions(sigs, {
      maxSupportedTransactionVersion: 0,
    });

    if (!txDetails) {
      console.log("Failed to get transaction details");
      logger.error("Failed to get transaction details");
      throw new Error("Failed to get transaction details");
    }

    const transactionChecker = new TransactionChecker();
    const transfers = transactionChecker.parseTransfer(txDetails, address);

    return [];
  }

  public async isStreamFlowLock(creator: string, tx: ParsedTransaction) {
    try {
      const checker: LockCheckerShape = {
        programId: [],
        token: null,
        amount: 0,
      };
      const ins = tx.message.instructions;

      for (const instruction of ins) {
        if (
          instruction.programId.toBase58() === TIMELOCK_ADDRESS.STREAMFLOW ||
          instruction.programId.toBase58() === SYSTEM_PROGRAM_ID
        ) {
          checker.programId.push(instruction.programId.toBase58());
        }
      }

      checker.token = tx.message.accountKeys[3].pubkey.toBase58();
      const balance = await this.connection.getTokenAccountsByOwner(
        new PublicKey(checker.token),
        {
          mint: this.address,
        }
      );

      const parsed = parseTokenAccountData(balance.value[0].account.data);
      checker.amount = parseFloat(parsed.amount.toString().slice(0, -6));

      return checker;
    } catch (error) {
      console.error(error);
      logger.error("Failed to check lock", error);
      throw new Error("Failed to check lock");
    }
  }

  public async getCreatorInfo() {
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

    return {
      address: creator,
      signature: signature,
      mint: this.address.toBase58(),
      token: tokenInfo.value[0].pubkey.toBase58(),
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
